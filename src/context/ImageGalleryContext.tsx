"use client";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

type Images = string[] | []
type GalleryContextType = {
  images: Images;
  setImages: Dispatch<SetStateAction<Images>>;
};

type GalleryContextProviderProps = {
  children?: React.ReactNode;
};

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryContextProvider({
  children
}: GalleryContextProviderProps) {
  const [images, setImages] = useState<Images>([]);
  
  return (
    <GalleryContext.Provider
      value={{
        images,
        setImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGalleryContext() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error(
      "useGalleryContext must be used within a GalleryContextProvider"
    );
  }
  return context;
}
