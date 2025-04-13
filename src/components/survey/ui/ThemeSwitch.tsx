"use client";

import React from 'react';
import { useTheme } from "@/components/other/ThemeProvider";

const ThemeSwitch: React.FC = ({ }) => {
    const { theme, setTheme } = useTheme();
    
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = e.target.checked ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <div className="relative w-[51px] h-[31px]">
            <input
                type="checkbox"
                className="opacity-0 w-0 h-0 absolute"
                id="theme-switch"
                checked={theme === "dark"}
                onChange={handleToggle}
            />
            <label
                className={`block w-full h-full rounded-2xl cursor-pointer transition-all duration-200 ease-out ${
                    theme === "dark" ? 'bg-[#34C759]' : 'bg-[#e9e9eb]'
                }`}
                htmlFor="theme-switch"
            >
                <span
                    className={`absolute w-[27px] h-[27px] rounded-full bg-white 
                        shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_3px_1px_rgba(0,0,0,0.06)] 
                        transition-all duration-200 ease-out cursor-pointer 
                        flex items-center justify-center ${
                            theme === "dark"
                                ? 'left-[calc(50%-27px/2+10px)] top-[calc(50%-27px/2)]'
                                : 'left-[calc(50%-27px/2-10px)] top-[calc(50%-27px/2)]'
                        }`}
                >
                    {theme === "dark" ? (
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-4 h-4 text-blue-800"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    ) : (
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-4 h-4 text-amber-500"
                        >
                            <path 
                                d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" 
                            />
                        </svg>
                    )}
                </span>
            </label>
        </div>
    );
};

export default ThemeSwitch;