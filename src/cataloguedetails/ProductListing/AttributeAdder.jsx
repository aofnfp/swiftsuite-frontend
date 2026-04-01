import { Button } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";

const AttributeAdder = ({ onChange, initial = [] }) => {
  const normalizeInitial = (init) => {
    if (Array.isArray(init)) return init;
    if (init && typeof init === "object") {
      return Object.entries(init).map(([label, value]) => ({ label, value }));
    }
    return [];
  };

  const [attributes, setAttributes] = useState(normalizeInitial(initial));

  // Keep a ref to the latest onChange callback so we don't have to
  // include it in the effect dependency array. If the parent recreates
  // the handler on every render, including it in deps causes an
  // infinite loop (effect -> onChange -> parent setState -> new handler -> effect...).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const filtered = attributes.filter((a) => a.label || a.value);
    if (onChangeRef.current) onChangeRef.current(filtered);
  }, [attributes]);

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { label: "", value: "" }]);
  };

  const updateAttribute = (index, field, value) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const removeAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">WooCommerce Attributes</h4>
        <Button
          className="text-white"
          type="button"
          onPress={addAttribute}
          variant='solid'
          color="success"
          size="lg"
        >
          Add attribute
        </Button>
      </div>

      <div className="space-y-2">
        {attributes.length === 0 && (
          <p className="text-sm text-gray-500">No attributes added yet.</p>
        )}

        {attributes.map((attr, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between space-x-2 border border-gray-200 p-2 rounded w-full"
          >
            <input
              type="text"
              value={attr.label}
              placeholder="Label"
              onChange={(e) => updateAttribute(idx, "label", e.target.value)}
              className="border border-gray-300 rounded p-2 w-1/2"
            />
            <input
              type="text"
              value={attr.value}
              placeholder="Value"
              onChange={(e) => updateAttribute(idx, "value", e.target.value)}
              className="border border-gray-300 rounded p-2 w-1/2"
            />
            <Button
              type="button"
              onPress={() => removeAttribute(idx)}
              value='outline'
              color="danger"
              size="sm"
            >
              <MdDelete size={20} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeAdder;
