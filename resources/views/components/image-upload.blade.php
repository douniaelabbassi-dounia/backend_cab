<div>
    <div id='input-media-container' style="display:none;">
        <label for="{{ $id }}" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, MP4</p>
            </div>
            <input id="{{ $id }}" name="{{ $name }}" type="file" class="hidden"
                accept="image/png, image/jpeg, video/mp4" />
        </label>
    </div>

    {{-- Media Preview --}}
    <div class="w-full min-h-64 max-h-fit flex justify-center" id='preview-media-container' style="display:none;">
        <div class="w-full flex justify-end">
            <button type="button" class="p-2.5 text-center inline-flex items-center"
                id='close-preview-media-container'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </button>
        </div>
        <div class="w-full flex justify-center">
            <img id="image-preview-{{ $id }}" src="#" alt="Image Preview" class="h-auto w-auto object-cover rounded-lg" style="display:none;" />
            <video id="video-preview-{{ $id }}" controls class="h-auto w-auto object-cover rounded-lg" style="display:none;">
                <source id="video-source-{{ $id }}" src="#" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
    
    {{-- Error Message --}}
    <x-input-error class="mt-2" :messages="$errors->get($name)" />
</div>

<script>
    var extention = '{{ $extention }}';
    var url = '{{ $url }}';

    console.log(extention,url,'check check')

    if(extention.length > 0 && url.length > 0){
        document.getElementById('preview-media-container').style.display = 'block';
        document.getElementById('input-media-container').style.display = 'none';
        if(extention == 'mp4'){
            document.getElementById('video-preview-{{ $id }}').style.display = 'block';
            document.getElementById('image-preview-{{ $id }}').style.display = 'none';

            document.getElementById('image-preview-{{ $id }}').src = '';
        document.getElementById('video-source-{{ $id }}').src = url;

        }else{
            document.getElementById('video-preview-{{ $id }}').style.display = 'none';
            document.getElementById('image-preview-{{ $id }}').style.display = 'block';

            document.getElementById('image-preview-{{ $id }}').src = url;
            document.getElementById('video-source-{{ $id }}').src = '';
        }
        
    }else{

        document.getElementById('preview-media-container').style.display = 'none';
        document.getElementById('input-media-container').style.display = 'flex';

        document.getElementById('video-preview-{{ $id }}').style.display = 'none';
        document.getElementById('image-preview-{{ $id }}').style.display = 'block';
        
        
        
    }
    
    document.getElementById('{{ $id }}').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            const fileType = file.type.split('/')[0];

            reader.onload = function(e) {
                document.getElementById('preview-media-container').style.display = 'block';
                document.getElementById('input-media-container').style.display = 'none';

                if (fileType === 'image') {
                    document.getElementById('image-preview-{{ $id }}').style.display = 'block';
                    document.getElementById('video-preview-{{ $id }}').style.display = 'none';
                    document.getElementById('image-preview-{{ $id }}').src = e.target.result;
                } else if (fileType === 'video') {
                    document.getElementById('video-preview-{{ $id }}').style.display = 'block';
                    document.getElementById('image-preview-{{ $id }}').style.display = 'none';
                    document.getElementById('video-source-{{ $id }}').src = e.target.result;
                    document.getElementById('video-preview-{{ $id }}').load();
                }
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('close-preview-media-container').addEventListener('click', function() {
        document.getElementById('preview-media-container').style.display = 'none';
        document.getElementById('input-media-container').style.display = 'block';
        document.getElementById('image-preview-{{ $id }}').src = '';
        document.getElementById('video-source-{{ $id }}').src = '';
        document.getElementById('{{ $id }}').value = null;
    });
</script>