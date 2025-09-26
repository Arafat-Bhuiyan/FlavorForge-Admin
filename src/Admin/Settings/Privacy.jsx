"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import authApiInstance from "../../utils/privateApiInstance";
import { toast } from "react-toastify";

export default function Privacy() {
  const [privacy, setPrivacy] = useState(""); // fetched/saved content
  const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState("12");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  // Fetch privacy policy on mount
  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        setLoading(true);
        const res = await authApiInstance.get("/privacy-policy/");
        setPrivacy(res.data.content || ""); // content key from API
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
        toast.error("Failed to fetch privacy policy");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacy();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) handleSave(); // save on toggle off
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await authApiInstance.patch("/privacy-policy/", { content: privacy });
      toast.success("Privacy Policy updated successfully!");
    } catch (error) {
      console.error("Failed to save privacy policy:", error);
      toast.error("Failed to save privacy policy");
    } finally {
      setLoading(false);
    }
  };

  const applyFormat = (command, value = null) => {
    if (contentRef.current && isEditing) {
      document.execCommand(command, false, value);
      contentRef.current.focus();
    }
  };

  // Font-size apply function
  const applyFontSize = (size) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const wrapper = document.createElement("span");
    wrapper.style.fontSize = `${size}px`;

    try {
      range.surroundContents(wrapper);
    } catch (err) {
      // multiple nodes selection issue
      document.execCommand("fontSize", false, "7");
      const fontElements = document.getElementsByTagName("font");
      for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = `${size}px`;
        }
      }
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    applyFontSize(newSize);
  };

  return (
    <div className="flex flex-col gap-6 text-[#2e2e2e]">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-base">Privacy Policy Management</h1>
        <button
          onClick={handleEditToggle}
          className="bg-[#E4572E] text-white text-base font-medium px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 w-40"
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Toolbar */}
      {isEditing && (
        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded bg-gray-50">
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {[10, 12, 14, 16, 18, 20, 24].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <button
            onClick={() => applyFormat("bold")}
            title="Bold"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => applyFormat("italic")}
            title="Italic"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => applyFormat("underline")}
            title="Underline"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Underline size={16} />
          </button>

          <button
            onClick={() => applyFormat("justifyLeft")}
            title="Align Left"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => applyFormat("justifyCenter")}
            title="Align Center"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => applyFormat("justifyRight")}
            title="Align Right"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <AlignRight size={16} />
          </button>
        </div>
      )}

      {/* Content editor */}
      {isEditing ? (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full min-h-screen p-4 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: privacy }}
          onBlur={(e) => setPrivacy(e.currentTarget.innerHTML)}
        />
      ) : (
        <div
          className="max-w-6xl min-h-screen rounded text-base resize-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: privacy }}
        />
      )}
    </div>
  );
}
