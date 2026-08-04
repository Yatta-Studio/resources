import { useState } from "react";

const App = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-900">
            {/* Backdrop for Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden ${isOpen ? "block" : "hidden"}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar Component */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-5 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Sidebar Header (Logo/Brand) */}
                <div className="flex h-14 items-center justify-between px-2">
                    <span className="text-xl font-bold tracking-tight text-indigo-600">
                        BrandLogo
                    </span>
                    {/* Close Button (Mobile Only) */}
                    <button
                        className="rounded-md p-1.5 hover:bg-slate-100 md:hidden"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6 flex-1 space-y-1">
                    <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600"
                    >
                        <span>Dashboard</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <span>Analytics</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <span>Settings</span>
                    </a>
                </nav>

                {/* Sidebar Footer (User Profile) */}
                <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-9 w-9 rounded-full bg-slate-200"></div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold">
                                Alex Morgan
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                alex@example.com
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area Container */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navbar (Mobile Only Toggle Header) */}
                <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                    <span className="text-lg font-bold text-indigo-600">
                        BrandLogo
                    </span>
                    <button
                        className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </header>

                {/* Page Scrollable Viewport */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-5xl">
                        {/* Page Header */}
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            Dashboard Overview
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage your application metrics and settings.
                        </p>

                        {/* Mock Page Content */}
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                                Card Content 1
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                                Card Content 2
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                                Card Content 3
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
