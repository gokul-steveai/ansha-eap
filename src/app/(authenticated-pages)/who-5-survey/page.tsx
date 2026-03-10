import WHO5FormComponent from "@/components/forms/formWhoFive";

const Page = () => {
  
  return (
    <div className="md:w-[800px] mx-auto p-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-1">Complete the WHO-5 Survey</h1>
        <p className="text-sm">
          Please complete this short well-being survey before you can access your dashboard.
        </p>
      </div>

      <WHO5FormComponent />
    </div>
  );
}

export default Page;
