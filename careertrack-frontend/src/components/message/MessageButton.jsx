
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function MessageButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/student/chat")}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md sm:p-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition-colors group-hover:bg-violet-600 group-hover:text-white">
          <MessageCircle className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">
            Messages
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chat with fellow students
          </p>
        </div>
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-violet-600 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
