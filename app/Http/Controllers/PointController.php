<?php

namespace App\Http\Controllers;

use App\Models\AffluencePoint;
use App\Models\EventPoint;
use App\Models\StationPoint;
use App\Models\JaunePoint;
use App\Models\NotePoint;
use App\Models\Point;
use App\Models\PointFeedback;
use App\Models\User;
use App\Services\ParticipationService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class PointController extends Controller
{
    protected $participationService;

    function __construct(ParticipationService $participationService){
        $this->middleware(['auth:sanctum']);
        $this->participationService = $participationService;
    }

    function newPoint(Request $request) {
        date_default_timezone_set('Europe/Paris');
        $point = null; $otherpoint = null; $check = '';
        try {
            $user = auth()->user();

            DB::beginTransaction();

            $point = new Point();
            $point->name = $request->name;
            $point->address = $request->address;
            $point->lat = $request->lat;
            $point->lng = $request->lng;
            $point->userID = $user->id;
            $point->typePoint = $request->typePoint;
            $point->save();

            if($request->typePoint == 'red'){
                $otherpoint = new AffluencePoint();
                $otherpoint->pointId = $point->id;
                if ($request->has('level')) {
                    $otherpoint->level = $request->level;
                }
                $check = 'red';
            }
            if($request->typePoint == 'green'){
                $otherpoint = new StationPoint();
                $otherpoint->pointId = $point->id;
                if ($request->has('level')) { $otherpoint->level = $request->level; }
                $otherpoint->name = $request->name;
                $otherpoint->lieu = $request->lieu;
                $otherpoint->type = $request->type;
                $otherpoint->dates = $request->date;
                $otherpoint->heureDebut = $request->heureDebut;
                $otherpoint->heureFin = $request->heureFin;
                $check = 'green';
            }
            if($request->typePoint == 'jaune'){
                $otherpoint = new JaunePoint();
                $otherpoint->pointId = $point->id;
                $otherpoint->name = $request->name;
                $otherpoint->msg = $request->msg;
                $otherpoint->numeroTel = $request->numeroTel;
                $check = 'jaune';
                $user->pointDuration+=10;
            }
            else if ($request->typePoint == 'note') {
                $otherpoint = new NotePoint();
                $otherpoint->pointId = $point->id;
                $otherpoint->name = $request->destination;
                $otherpoint->lieu = $request->lieu;
                $otherpoint->type = $request->type;
                $selectedDays = is_array($request->selectedDays) ? $request->selectedDays : [$request->selectedDays];
                $otherpoint->dates = implode(",", $selectedDays);
                $otherpoint->heureDebut = $request->heureDebut;
                $check = 'note';
                $user->pointDuration+=10;
            } else if($request->typePoint == 'event'){
                $otherpoint = new EventPoint();
                $otherpoint->pointId = $point->id;
                $otherpoint->lieu = $request->lieu;
                $otherpoint->type = $request->type;
                $otherpoint->dates = $request->date;
                $otherpoint->heureDebut = $request->heureDebut;
                $otherpoint->heureFin = $request->heureFin;
                $otherpoint->level = ($request->has('level') && $request->level !== null && $request->level !== '') ? $request->level : '1';
                $check = 'event';
            }

            if (isset($otherpoint)) { $otherpoint->save(); }

            DB::commit();

            // Award points after commit to avoid nested transaction conflicts
            try {
                switch ($request->typePoint) {
                    case 'red':
                        if ($request->has('level')) {
                            $this->participationService->addPointsForAffluence($user, $request->level);
                        }
                        break;
                    case 'green':
                        $this->participationService->addPointsForStation($user);
                        break;
                    case 'event':
                        $this->participationService->addPointsForEvent($user);
                        break;
                }
            } catch (\Exception $awardEx) {
                \Log::warning('Participation award failed after point creation: ' . $awardEx->getMessage());
            }

            // Fetch the newly created point with all its relations
            $newPoint = Point::where('id', $point->id)
                            ->with(['user.role', 'affluence', 'event', 'station', 'note', 'feedback', 'sos'])
                            ->first();

            $processedPoint = $this->processPoints([$newPoint]);

            return response()->json([
                'done' => true,
                'point' => $processedPoint,
                'type' => $check
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            if(isset($point)){
                try { $point->forceDelete(); } catch (\Exception $ignored) {}
            }
            return response()->json(['done' => false, 'message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }

    private function processPoints($points)
    {
        $redPoint = [];
        $eventPoint = [];
        $stationPoint = [];
        $notePoint = [];
        $jaunePoint = [];
    
        foreach ($points as $el) {
            $likes = $el->feedback->where('feedback', 'like')->count();
            $dislikes = $el->feedback->where('feedback', 'dislike')->count();
    
            switch ($el->typePoint) {
                case 'event':
                    // BUG FIX: Per client request, show ALL events regardless of their start/end time.
                    if ($el->event) {
                        array_push($eventPoint, [
                            "id" => $el->id, "lieu" => $el->event->lieu, "type" => $el->event->type, "date" => $el->event->dates, "heureDebut" => $el->event->heureDebut, "heureFin" => $el->event->heureFin, "level" => $el->event->level, "name" => $el->name, "address" => $el->address, "lat" =>  $el->lat, "lng" =>  $el->lng,
                            "userId" => $el->user ? $el->user->id : null,
                            "username" => $el->user ? ($el->user->firstName . " " . $el->user->lastName) : 'Utilisateur inconnu',
                            "like" => $likes, "dislike" => $dislikes, "object" =>  null,
                            "role" => $el->user && $el->user->role ? $el->user->role->role_name : 'Role inconnu',
                            "created_at" => $el->created_at->toIso8601String(), "updated_at" => $el->updated_at->toIso8601String()
                        ]);
                    }
                    break;
                case 'note':
                    if ($el->note) {
                        array_push($notePoint, [
                            "id" => $el->id, "lieu" => $el->note->lieu, "type" => $el->note->type, "date" => $el->note->dates, "heureDebut" => $el->note->heureDebut, "level" => $el->note->level, "name" => $el->note->name, "lat" =>  $el->lat, "lng" =>  $el->lng,
                            "userId" => $el->user ? $el->user->id : null,
                            "username" => $el->user ? ($el->user->firstName . " " . $el->user->lastName) : 'Utilisateur inconnu',
                            "like" => $likes, "dislike" => $dislikes, "object" =>  null,
                            "role" => $el->user && $el->user->role ? $el->user->role->role_name : 'Role inconnu',
                            "created_at" => $el->created_at->toIso8601String(), "updated_at" => $el->updated_at->toIso8601String()
                        ]);
                    }
                    break;
                case 'green':
                    if ($el->station) {
                        array_push($stationPoint, [
                            "id" => $el->id, "name" => $el->name, "address" => $el->address,
                            "lat" =>  $el->lat, "lng" =>  $el->lng,
                            "userId" => $el->user ? $el->user->id : null,
                            "username" => $el->user ? ($el->user->firstName . " " . $el->user->lastName) : 'Utilisateur inconnu',
                            "level" => $el->station->level, "like" => $likes, "dislike" => $dislikes,
                            "polyline" => $el->station->polyline,
                            "object" =>  null,
                            "role" => $el->user && $el->user->role ? $el->user->role->role_name : 'Role inconnu',
                            "created_at" => $el->created_at->toIso8601String(), "updated_at" => $el->updated_at->toIso8601String()
                        ]);
                    }
                    break;
                case 'jaune':
                    if ($el->sos) {
                        array_push($jaunePoint, [
                            "id" => $el->id, "name" => $el->name, "address" => $el->address,
                            "msg" => $el->sos->msg, "numeroTel" => $el->sos->numeroTel,
                            "lat" => $el->lat, "lng" => $el->lng,
                            "userId" => $el->user ? $el->user->id : null,
                            "username" => $el->user ? ($el->user->firstName . " " . $el->user->lastName) : 'Utilisateur inconnu',
                            "level" => $el->sos->level ?? null, "like" => $likes, "dislike" => $dislikes,
                            "object" => null,
                            "role" => $el->user && $el->user->role ? $el->user->role->role_name : 'Role inconnu',
                            "created_at" => $el->created_at->toIso8601String(), "updated_at" => $el->updated_at->toIso8601String()
                        ]);
                    }
                    break;
                case 'red':
                    if ($el->affluence) {
                        array_push($redPoint, [
                            "id" => $el->id, "name" => $el->name, "address" => $el->address,
                            "lat" =>  $el->lat, "lng" =>  $el->lng,
                            "userId" => $el->user ? $el->user->id : null,
                            "username" => $el->user ? ($el->user->firstName . " " . $el->user->lastName) : 'Utilisateur inconnu',
                            "level" => $el->affluence->level, "like" => $likes, "dislike" => $dislikes,
                            "object" =>  null,
                            "role" => $el->user && $el->user->role ? $el->user->role->role_name : 'Role inconnu',
                            "created_at" => $el->created_at->toIso8601String(), "updated_at" => $el->updated_at->toIso8601String()
                        ]);
                    }
                    break;
            }
        } 
    
        return ['red'=> $redPoint, 'event' => $eventPoint ,'green'=>$stationPoint , 'note'=>$notePoint ,'sos'=>$jaunePoint];
    }

    function getAllPoints() {
        try {
            $points = Point::whereIn('status', ['active', 'unactive'])
                ->with(['user.role', 'affluence', 'event', 'station', 'note', 'feedback', 'sos'])
                ->orderBy('created_at')->get();

            $processedPoints = $this->processPoints($points);

            return response()->json($processedPoints, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }

    function getAllMyPoints() {
        try {
            $user = auth()->user();
            $points = Point::where('userID', $user->id)
                          ->whereIn('status', ['active', 'transparent'])
                          ->with(['user.role', 'affluence', 'event', 'station', 'note', 'feedback', 'sos'])
                          ->orderBy('created_at')
                          ->get();

            $processedPoints = $this->processPoints($points);

            return response()->json($processedPoints, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error from server: ' . $e->getMessage()], 500);
        }
    }

    function getDetailPoint(Request $request) {
        try {
            $point = Point::where('id', $request->pointId)->with(['event'])->first();
            return response()->json($point, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }

    function updatePoint(Request $request) {
        try {
            switch($request->type) {
                case 'event':
                    $point = Point::where('id', $request->pointId)->with(['event'])->first();
                    if (!$point || !$point->event) {
                        return response()->json(['success' => false, 'message' => 'Point ou détail de l\'événement introuvable.'], 404);
                    }
                    $relatedPoint = $point->event;
                    $relatedPoint->lieu = $request->lieu;
                    $relatedPoint->type = $request->type;
                    $relatedPoint->dates = $request->date;
                    $relatedPoint->heureDebut = $request->heureDebut;
                    $relatedPoint->heureFin = $request->heureFin;
                    break;

                case 'red':
                    $point = Point::where('id', $request->pointId)->with(['affluence'])->first();
                    if (!$point || !$point->affluence) {
                        return response()->json(['success' => false, 'message' => 'Point ou détail d\'affluence introuvable.'], 404);
                    }
                    $relatedPoint = $point->affluence;
                    $relatedPoint->level = $request->level;
                    break;

                case 'green':
                    $point = Point::where('id', $request->pointId)->with(['station'])->first();
                    if (!$point || !$point->station) {
                        return response()->json(['success' => false, 'message' => 'Point ou détail de station introuvable.'], 404);
                    }
                    $relatedPoint = $point->station;
                    $relatedPoint->level = $request->level;
                    $relatedPoint->name = $request->name;
                    $relatedPoint->lieu = $request->lieu;
                    $relatedPoint->type = $request->type;
                    $relatedPoint->dates = $request->date;
                    $relatedPoint->heureDebut = $request->heureDebut;
                    $relatedPoint->heureFin = $request->heureFin;
                    if ($request->has('polyline')) {
                        $relatedPoint->polyline = $request->polyline;
                    }
                    break;

                case 'jaune':
                    $point = Point::where('id', $request->pointId)->with(['sos'])->first();
                    if (!$point || !$point->sos) {
                        return response()->json(['success' => false, 'message' => 'Point ou détail SOS introuvable.'], 404);
                    }
                    $relatedPoint = $point->sos;
                    $relatedPoint->msg = $request->msg;
                    $relatedPoint->numeroTel = $request->numeroTel;
                    $relatedPoint->type = $request->type;
                    $relatedPoint->dates = $request->date;
                    break;

                case 'note':
                    $point = Point::where('id', $request->pointId)->with(['note'])->first();
                    if (!$point || !$point->note) {
                        return response()->json(['success' => false, 'message' => 'Point ou détail de note introuvable.'], 404);
                    }
                    $relatedPoint = $point->note;
                    $relatedPoint->name = $request->name;
                    $relatedPoint->lieu = $request->lieu;
                    $relatedPoint->type = $request->type;
                    $relatedPoint->dates = $request->date;
                    $relatedPoint->heureDebut = $request->heureDebut;
                    $relatedPoint->heureFin = $request->heureFin;
                    break;

                default:
                    $point = Point::where('id', $request->pointId)->with(['note'])->first();
                    $relatedPoint = $point->note;
                    $relatedPoint->name = $request->name;
                    $relatedPoint->lieu = $request->lieu;
                    $relatedPoint->type = $request->type;
                    $relatedPoint->dates = $request->date;
                    $relatedPoint->heureDebut = $request->heureDebut;
                    $relatedPoint->heureFin = $request->heureFin;
                    break;
            }

            // Update main point if needed
            if ($request->has('name')) {
                $point->name = $request->name;
            }
            if ($request->has('address')) {
                $point->address = $request->address;
            }
            if ($request->has('lat')) {
                $point->lat = $request->lat;
            }
            if ($request->has('lng')) {
                $point->lng = $request->lng;
            }

            $point->save();
            $relatedPoint->save();
            $point->touch();

            return response()->json([
                'success' => true,
                'message' => 'Le point a été mis à jour avec succès!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error from server: ' . $e->getMessage()
            ], 500);
        }
    }

    function updateLvlPoint(Request $request) {
        try {
            $point = Point::where('id', $request->pointId)->with(['affluence'])->first();
            if (!$point || !$point->affluence) {
                return response()->json(['data' => false, 'message' => 'Point ou détail d\'affluence introuvable.'], 404);
            }
            $affluence = $point->affluence;
            $affluence->level = $request->level;
            $affluence->save();
            $point->touch();

            return response()->json(['data' => $affluence, 'message' => 'le niveau a ete modifier'], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => false, 'message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }

   function deletePoint(Request $request) {
    try {
        switch($request->type) {
            case "event":
                $point = Point::where('id', $request->pointId)->with(['event', 'user'])->first();
                if (!$point) { return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404); }
                if ($point->user) {
                    $this->participationService->deductPointsForDeletion($point->user, 'event');
                }
                if ($point->event) {
                    $point->event->delete();
                }
                $point->delete();
                break;

            case "red":
                $point = Point::where('id', $request->pointId)->with(['affluence', 'user'])->first();
                if (!$point) { return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404); }
                if ($point->user && $point->affluence) {
                    $this->participationService->deductPointsForDeletion($point->user, 'red', $point->affluence->level);
                }
                if ($point->affluence) {
                    $point->affluence->delete();
                }
                $point->delete();
                break;

            case "green":
                $point = Point::where('id', $request->pointId)->with(['station', 'user'])->first();
                if (!$point) { return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404); }
                if ($point->user) {
                    $this->participationService->deductPointsForDeletion($point->user, 'green');
                }
                if ($point->station) {
                    $point->station->delete();
                }
                $point->delete();
                break;

            case "jaune":
                $point = Point::where('id', $request->pointId)->with(['sos'])->first();
                if (!$point) { return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404); }
                if ($point->sos) {
                    $point->sos->delete();
                }
                $point->delete();
                break;

            case "note":
                $point = Point::where('id', $request->pointId)->with(['note'])->first();
                if (!$point) { return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404); }
                if ($point->note) {
                    $point->note->delete();
                }
                $point->delete();
                break;

            default:
                return response()->json([
                    'data' => false,
                    'message' => 'Type de point invalide'
                ], 400);
        }

        return response()->json([
            'data' => true,
            'message' => 'Le point a été supprimé avec succès!'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'data' => false,
            'message' => 'Error from server: ' . $e->getMessage()
        ], 500);
    }
}
    function feedbackPoint(Request $request) {
        try {
            $userGivingFeedback = auth()->user();
            $point = Point::where('id', $request->pointId)->with('feedback')->first();
            if (!$point) {
                return response()->json(['data' => false, 'message' => 'Point introuvable.'], 404);
            }
            $dislikes = 0;

            foreach($point->feedback as $feedbackItemd){
                if($feedbackItemd->feedback == 'dislike'){
                    $dislikes += 1;
                }
            }

            $user = User::find($point->userID);

            if(!$user){
                return response()->json(['data' => false, 'message' => 'L\'utilisateur qui a créé ce point n\'est plus disponible.'], 404);
            }
            $feedback = PointFeedback::where("pointId", $point->id)->where('userId', $userGivingFeedback->id)->first();

            if($feedback){
                if($feedback->feedback == 'like' && $request->feedback == 'like'){
                    $feedback->delete();
                    $point->like -= 1;
                    $user->likes -= 1;
                }else if($feedback->feedback == 'dislike' && $request->feedback == 'dislike'){
                    $feedback->delete();
                    $point->dislike -= 1;
                    $user->dislikes -= 1;
                }else if($feedback->feedback == 'like' && $request->feedback == 'dislike'){
                    $dislikes += 1;
                    if($dislikes >= 2 ){
                        $point->dislike += 1;
                        $point->status = 'unactive';
                    }else if($dislikes < 2){
                        $feedback->feedback = 'dislike';
                        $feedback->save();
                        $point->dislike += 1;
                        $point->like = $point->like - 1 >= 0? $point->like - 1 : 0;
                    }
                        $user->dislikes += 1;
                        $user->likes = $user->like - 1 >= 0? $user->like - 1 : 0;
                }else if($feedback->feedback == 'dislike' && $request->feedback == 'like'){
                        $feedback->feedback = 'like';
                        $feedback->save();
                        $point->dislike += 1;
                        $user->dislikes += 1;
                        $point->like -= 1;
                        $user->likes -= 1;
                }
            }else {
                $newFeedback = new PointFeedback();
                $newFeedback->userId = $userGivingFeedback->id;
                $newFeedback->pointId = $point->id;
                $newFeedback->feedback = $request->feedback;
                $newFeedback->save();

                if($request->feedback == 'like'){
                    $this->participationService->addPointsForLike($userGivingFeedback);
                    $point->like += 1;
                    $user->likes += 1;
                }else if($request->feedback == 'dislike'){
                    $point->dislike += 1;
                    $user->dislikes += 1; // Bug fix: was likes

                    // False report penalty logic
                    $point->load(['user', 'affluence', 'feedback']);
                    $isEligibleForPenalty = $point->user && $point->typePoint == 'red' && $point->affluence &&
                        in_array($point->affluence->level, [3, 4]) &&
                        now()->diffInMinutes($point->created_at) < 5;

                    if ($isEligibleForPenalty) {
                        $dislikeCount = $point->feedback
                            ->where('feedback', 'dislike')
                            ->where('userId', '!=', $point->user->id)
                            ->count();
                        
                        if ($dislikeCount >= 2) {
                           $this->participationService->deductPointsForFalseReport($point->user);
                        }
                    }
                }
            }
            $user->save();
            $point->save();
            return response()->json(['data' => true, 'message' => 'votre avis a été envoyé avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['data' => false, 'message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }

    function disablePoint(Request $request) {
        try {
            Point::whereIn('id', $request->ids)->update([
                'status' => 'unactive'
            ]);
            return response()->json(['data' => true, 'message' => 'les points sont desactive avec succès'], 200);

        } catch (\Exception $e) {
            return response()->json(['data' => false, 'message' => 'error from server :  '. $e->getMessage()], 500);
        }
    }
}
