interface ThemeSwitchProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Custom Switch component for dark mode toggle
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ checked, onChange }) => {
    return (
        <div className="relative w-[51px] h-[31px]">
            <input
                type="checkbox"
                className="opacity-0 w-0 h-0 absolute"
                id="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <label
                className={`block w-full h-full rounded-2xl cursor-pointer transition-all duration-200 ease-out ${checked ? 'bg-[#34C759]' : 'bg-[#e9e9eb]'}`}
                htmlFor="checkbox"
            >
                <span
                    className={`absolute w-[27px] h-[27px] rounded-full bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_3px_1px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out cursor-pointer ${checked
                            ? 'left-[calc(50%-27px/2+10px)] top-[calc(50%-27px/2)]'
                            : 'left-[calc(50%-27px/2-10px)] top-[calc(50%-27px/2)]'
                        }`}
                />
            </label>
        </div>
    );
};

export default ThemeSwitch;