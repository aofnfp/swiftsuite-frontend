import React, { useEffect, useState, useCallback, useMemo } from "react";
import { User, Camera } from "lucide-react";
import avatarPlaceholder from "../Images/avatar.webp";
import { getImage } from "../api/authApi";

const Profileimage = ({
  size = "md",
  className = "",
  showHover = true,
  showPlaceholder = true,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const userId = localStorage.getItem("userId");

  const sizeClasses = {
    xs: "w-8 h-8 text-xs",
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-32 h-32 text-2xl",
  };

  const iconSize = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 28,
    xl: 36,
    "2xl": 48,
  };

  // Fetch directly from backend
  const fetchProfileImage = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const res = await getImage({ userId });
      if (res?.profile_image) {
        setImageSrc(res.profile_image);
      } else {
        setImageSrc(null);
      }
      setHasError(false);
    } catch (err) {
      console.error("Error fetching profile image:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileImage();

    // Update immediately after image change
    const handler = async () => {
      await fetchProfileImage();
    };

    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, [fetchProfileImage]);

  const src = useMemo(() => {
    if (hasError || !imageSrc) return avatarPlaceholder;
    return imageSrc;
  }, [imageSrc, hasError]);

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const icon = iconSize[size] || iconSize.md;

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden 
      ring-4 ring-white shadow-lg transition-all duration-300
      ${sizeClass} ${className}`}
      role="img"
      aria-label="Profile picture"
    >
      <img
        src={src}
        alt="Profile"
        className={`w-full h-full object-cover transition-opacity duration-300
        ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading="lazy"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="w-1/2 h-1/2 bg-gray-300 rounded-full animate-pulse" />
        </div>
      )}

      {showHover && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Camera size={icon} className="text-white opacity-80" />
        </div>
      )}

      {!imageSrc && showPlaceholder && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#027840]/10 to-[#025c33]/10">
          <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <User size={icon} className="text-[#027840]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profileimage;
