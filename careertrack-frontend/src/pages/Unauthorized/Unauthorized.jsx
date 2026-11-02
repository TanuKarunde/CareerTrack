const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-purple-600">
                    403
                </h1>

                <h2 className="text-2xl font-semibold mt-4 text-gray-900">
                    Access Denied
                </h2>

                <p className="text-gray-500 mt-2">
                    You don't have permission to access this page.
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;