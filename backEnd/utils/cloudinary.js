const cloudinary=require('cloudinary');
          
cloudinary.config({ 
  cloud_name: 'dd4lbwpfq', 
  api_key: '356736598798433', 
  api_secret: 'oFkZi74Nx4NpruG_QfvVoQPC3aA' 
});


const cloudinaryUploadImage = async (fileToUpload)=>{
    try{
        const data =await cloudinary.uploader.upload(fileToUpload,{
            resource_type:'auto'
        })
        return data
    }catch(error){
        return error
    }
}
const cloudinaryRemoveImage = async (imagePublicId)=>{
    try{
        const result =await cloudinary.uploader.destroy(imagePublicId)
        return result
        
    }catch(error){
        return error
    }
}
module.exports ={
    cloudinaryRemoveImage,cloudinaryUploadImage
}