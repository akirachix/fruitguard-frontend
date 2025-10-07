"use client";
import React from "react";
import { useEffect,useState } from "react";
import useProfile from "../hooks/useFetchProfile";
import { updateProfile } from "../utils/updateProfile";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Button from "../sharedComponents/Button";


export default function Profile() {
  const [token,setToken]=useState("")
  useEffect(()=>{
    const storedToken =localStorage.getItem("token");
    if (storedToken){
      setToken(storedToken);
    }
  },[]);
  const {profile, loading, error } = useProfile(token);
  const [formData, setFormData] = useState({first_name: "", last_name: "", email: "",});
  const [profileImage, setProfileImage] = useState<File |null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string |null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (profile) {setFormData({ first_name: profile.first_name ?? "", last_name: profile.last_name ?? "", email: profile.email ?? "",});
      setPreviewImage(profile.profile_image ?? ""); }}, [profile]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
   setFormData((oldData) => ({...oldData,[name]: value }));}

  async function handleSubmit(event: React.FormEvent) {event.preventDefault();
    if (!token){
      setUpdateError("No authorization token found")
      return;
    }
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      if (profileImage) data.append("profile_image", profileImage);

      await updateProfile(token, data);
      setUpdateSuccess(true);}
      
    catch (error) {
      if(error instanceof Error){
     setUpdateError(error.message);
    }
      else{
       setUpdateError("An unexpected error occurred");
       }
       
      }
    finally {
      setUpdating(false); 
     }
    }
    useEffect(() => {
    if (updateSuccess) {
    const timer = setTimeout(() => {
      setUpdateSuccess(false);
     }, 6000); 
    return () => clearTimeout(timer);
  }}, [updateSuccess]);

  return (
   
    <div className="flex justify-end min-h-screen">
        <main className="w-4/5 px-35 flex flex-col justify-center items-center ml-30 font-nunito">
          <h1 className="text-[#7B4F36] text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-15 -mt-4 text-left w-full">Profile</h1>
          {(loading || updating) && (<p>{loading ? "Loading profile…" : "Updating profile…"}</p>)}
          {(error || updateError) && (
          <p className="text-red-600">{error || updateError}</p>)}
            {profile && (
            <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-5xl">
                <div className="flex flex-col items-center md:items-start md:w-1/3 w-full">
                  <div className="relative inline-block">
                    <img src={previewImage || "/default-profile.png"} alt="Profile photo" width={160} height={160} className="rounded-full w-40 h-40 border-4 border-[#F5DBBC] object-cover"/>
                      <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-[#F5DBBC] rounded-full p-2 cursor-pointer"title="Edit profile image">
                        <HiOutlinePencilAlt className="h-6 w-6 text-yellow-500" />
                      </label>
                      <input type="file" id="profileImageInput" accept="image/*" className="hidden" onChange={(event) => {
                      if (event.target.files && event.target.files[0]) { const file = event.target.files[0];
                      setProfileImage(file);
                      setPreviewImage(URL.createObjectURL(file));}}}/>
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold text-[#683929] tracking-wide mb-3">{formData.first_name} {formData.last_name}</h2>
                  <p className="text-[#683929] text-lg mb-3">{profile.user_type || "User"}</p>
                  <p className="text-[#683929] text-lg">{formData.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 w-full max-w-lg space-y-8 md:mr-16 ml-12">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 text-[#683929] font-semibold text-2xl">First name</label>
                    <input id="firstName" name="first_name" type="text" placeholder="Enter first name" value={formData.first_name} onChange={handleInputChange} className="w-full p-4 border rounded-lg border-gray-300 placeholder-gray-400 text-lg"disabled={loading || updating} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-1 text-[#683929] font-semibold text-2xl">Last name</label>
                    <input id="lastName" name="last_name" type="text"placeholder="Enter last name"value={formData.last_name} onChange={handleInputChange} className="w-full p-4 border rounded-lg border-gray-300 placeholder-gray-400 text-lg"disabled={loading || updating}/>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 text-[#683929] font-semibold text-2xl">Email</label>
                    <input id="email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} className="w-full p-4 border rounded-lg border-gray-300 placeholder-gray-400 text-lg" disabled={loading || updating} />
                  </div>
                  <Button buttonText="Update" variant="default" onClickHandler={() => {}} className="bg-[#683929] text-white py-4 rounded-lg w-full font-semibold hover:bg-[#a46639] text-lg transition"/>
                  {updateSuccess && (
                   <p className="text-green-700 mb-4 w-full text-center text-1xl">Profile updated successfully!</p>)}
                </form>
              </div>)}
       </main>
     </div>
  );
}