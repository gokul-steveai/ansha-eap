import Image from "next/image";

export default function AppLogo() {
    return (
    <div className="logo-container flex flex-col items-center w-full justify-center p-5">
           {/* <IconLogo fill="#B92F60" width={45} /> */}
              {/* <h1 className="font-medium text-lg">ELEVATE</h1>
           <span className="text-xs">By ANSA</span> */}
           <Image
           className="p-2"
           width={125}
           height={100}
           src="/assets/images/elevate-dark.png"
           alt="Elevate"
           />

         </div>
    );
}