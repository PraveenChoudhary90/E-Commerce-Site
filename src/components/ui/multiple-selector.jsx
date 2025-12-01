import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";

const MultiSelect = ({ options, onSelect, placeholder = "Search..." }) => {
    const [search, setSearch] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search) {
            setFilteredOptions(options);
            return;
        }

        setLoading(true);
        const timeout = setTimeout(() => {
            const filtered = options.filter((option) =>
                option.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredOptions(filtered);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, options]);

    const handleSelect = useCallback(
        (value) => {
            setSelectedValues((prev) => {
                const updated = prev.includes(value)
                    ? prev.filter((v) => v !== value)
                    : [...prev, value];

                onSelect && onSelect(updated);
                return updated;
            });
        },
        [onSelect]
    );

    return (
        <Command>
            <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder={placeholder}
            />
            <Command.List>
                {loading && <Command.Loading>Loading...</Command.Loading>}
                {!loading &&
                    filteredOptions.map((option) => (
                        <Command.Item
                            key={option}
                            onSelect={() => handleSelect(option)}
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                readOnly
                            />
                            {option}
                        </Command.Item>
                    ))}
            </Command.List>
        </Command>
    );
};

export default MultiSelect;
