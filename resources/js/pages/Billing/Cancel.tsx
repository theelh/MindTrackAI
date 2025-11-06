import { dashboard } from "@/routes";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon } from "lucide-react";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl text-red-600 font-semibold">❌ Cancel subscription.</h1>
      <Link className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200" href={dashboard().url}>
        <ArrowLeftIcon className="w-5 h-5 mr-2"/>
        Back to dahsboard
      </Link>
    </div>
  );
}
