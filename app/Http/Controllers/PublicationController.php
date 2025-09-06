<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return view("publication.publications");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("publication.createPubication");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'view_number' => ['required'],
            'click_number' => ['required'],
            'media' => 'required|mimes:jpeg,png,jpg,mp4|max:10240',
        ]);

        
        //creating publication
        $is_active = $request->active == 'true';
        $new_publication = new Publication();
        $new_publication->title = $request->title;
        $new_publication->view_number = $request->view_number;
        $new_publication->click_number = $request->click_number;
        $new_publication->active = $is_active;
        $new_publication->order = $this->get_new_order() + 1;
        $new_publication->save();


        



        //creating and storing media 
        $media_extension = $request->media->extension();
        $new_media_name = time().'_'.'publication_media'.'_'.$new_publication->id.'.'.$media_extension;
        $file_path = 'publication_medias/'.$new_media_name;
        $request->media->move(public_path('publication_medias'), $new_media_name);
        $new_medie = new PublicationMedia();
        $new_medie->url = $file_path;
        $new_medie->type = $media_extension;
        $new_medie->save();
        
        //set publication_media_id
        $new_publication->publication_media_id = $new_medie->id;
        $new_publication->save();


       

        return redirect()->route('publications.create')->with(['status'=>'publication-created','newPublicationUrl'=>route('publications.edit',$new_publication->id)]);


    }


    public function reOrder_unActive_publication(){
        $unActive_publications = Publication::where('active',false)->orderBy('id','asc')->get();
        $new_order = $this->get_bigger_active_order();
        foreach ($unActive_publications as $publication) {
            $new_order += 1;
            $publication->order = $new_order;
            $publication->save();
        }
    }

    public function get_bigger_active_order(){
        $big_order = Publication::select('order')->where('active',true)->orderBy('order','desc')->first()->order ?? 0;
        
        return $big_order;
    }
    public function get_bigger_UnActive_order(){
        $big_order = Publication::select('order')->where('active',false)->orderBy('order','desc')->first()->order ?? 0;
        
        return $big_order;
    }


    public function get_new_order(){
        $new_order = Publication::select('order')->orderBy('order','desc')->first()->order ?? 0;
        
        return $new_order;
    }
    public function reOrder_publication(){
        $all_publications = Publication::orderBy('order','asc')->get();
        $new_order = 0;
        foreach ($all_publications as $publication) {
            $new_order += 1;
            $publication->order = $new_order;
            $publication->save();
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $publication = Publication::findOrFail($id);
        return view('publication.editePublication', ['publication'=> $publication]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'view_number' => ['required'],
            'click_number' => ['required'],
            'media' => 'mimes:jpeg,png,jpg,mp4|max:10240',
        ]);
        
        
        //update publication
        $publication = Publication::find($id);
        $old_active = $publication->active == 1;
        $new_active = $request->active == 'true';
        $publication->title = $request->title;
        $publication->view_number = $request->view_number;
        $publication->click_number = $request->click_number;
        $publication->active = $new_active;
        $publication->save();


        


        //updating publication media 
        if($request->media){
            $publication_media = PublicationMedia::find($publication->media()->first()->id);
            if( $publication_media ){
                //delete old file
                $old_url_path =public_path($publication_media->url);
                if (file_exists($old_url_path)) {
                    unlink($old_url_path);
                }
                //saving new file
                $media_extension = $request->media->extension();
                $new_media_name = time().'_'.'publication_media'.'_'.$publication->id.'.'.$media_extension;
                $file_path = 'publication_medias/'.$new_media_name;
                $request->media->move(public_path('publication_medias'), $new_media_name);

                //updating publication media
                $publication_media->url = $file_path;
                $publication_media->type = $media_extension;
                $publication_media->save();
            }
            
        }
        

        return redirect()->route('publications.edit',$publication->id)->with(['status'=> 'publication-updated']);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $publication = Publication::findOrFail($id);
        $image = $publication->media()->first();
        $file_path  = public_path($image->url);
        if (file_exists($file_path)) {
            unlink($file_path);
        }
        $publication->delete();
        $image->delete();
        $this->reOrder_publication();
        return redirect()->back()->with(['status'=>'publication-deleted']);
    }

    
}
