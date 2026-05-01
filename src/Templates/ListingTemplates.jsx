import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Plus, Search, Star } from "lucide-react";
import MaxTemplateModal from "./MaxTemplateModal";
import CreateTemplateModal from "./CreateTemplateModal";
import TemplatePreviewModal from "./TemplatePreviewModal";
import UploadTemplateModal from "./UploadTemplateModal";
import { Link } from "react-router-dom";


const planLimits = {
  Starter: 2,
  Growth: 5,
  Premium: 6,
  Enterprise: Infinity,
};

const templates = [
  {
    id: 1,
    name: "Fragrance & Beauty",
    color: "#112B52",
    accent: "#d998a6",
    gradient: "linear-gradient(90deg, #112B52 0%, #d998a6 100%)",
  },
  {
    id: 2,
    name: "Sports & Outdoors",
    color: "#3E6B34",
    accent: "#79b35d",
    gradient: "linear-gradient(90deg, #3E6B34 0%, #79b35d 100%)",
  },
  {
    id: 3,
    name: "Electronics & Tech",
    color: "#12365A",
    accent: "#5da2db",
    gradient: "linear-gradient(90deg, #12365A 0%, #5da2db 100%)",
  },
  {
    id: 4,
    name: "Home & Garden",
    color: "#B06C4F",
    accent: "#c99c65",
    gradient: "linear-gradient(90deg, #B06C4F 0%, #c99c65 100%)",
  },
  {
    id: 5,
    name: "Tools & Hardware",
    color: "#DB5B21",
    accent: "#c99c65",
    softAccent: "#DB5B2130",
  },
  {
    id: 6,
    name: "Jewelry & Watches",
    color: "#6B2BD9",
    accent: "#d6c3f5",
    gradient: "linear-gradient(90deg, #6B2BD9 0%, #d6c3f5 100%)",
  },
  {
    id: 7,
    name: "Pet Supplies",
    color: "#89D6E2",
    accent: "#2e5c88",
    softAccent: "#89D6E230",
  },
  {
    id: 8,
    name: "Office Business",
    color: "#70D59A",
    accent: "#027840",
    softAccent: "#70D59A30",
  },
  {
    id: 9,
    name: "Automotive & Parts",
    color: "#0D6836",
    accent: "#027840",
    softAccent: "#0D683630",
  },
  {
    id: 10,
    name: "Fashion & Apparel",
    color: "#286B73",
    accent: "#005D68",
    softAccent: "#286B7330",
  },
  {
    id: 11,
    name: "Toys & Collectibles",
    color: "#F2FF00",
    accent: "#ff1d1d",
    softAccent: "#F2FF0035",
  },
  {
    id: 12,
    name: "Health & Wellness",
    color: "#02A91F",
    accent: "#027840",
    softAccent: "#02A91F30",
  },
];

const TemplateCard = ({
  template,
  selected,
  disabled,
  favorite,
  onToggle,
  onFavorite,
  onPreview,
  createdView = false,
}) => {
  return (
    <div
      onClick={() => onPreview(template)}
      className={`relative shadow-sm overflow-hidden border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:border-[#027840]/40 active:scale-[0.98] ${
        disabled ? "blur-[2px] opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition flex items-center justify-center pointer-events-none">
        <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-md">
          Preview Template
        </span>
      </div>

      <div
        className="h-10 px-4 flex items-center justify-between"
        style={{ background: template.gradient || template.color }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: template.accent }}
          />
          <span
            className="h-1 rounded-full w-24"
            style={{ backgroundColor: template.accent }}
          />
        </div>

        <div className="flex gap-3">
          <span className="h-1 w-4 rounded-full bg-white/70" />
          <span className="h-1 w-4 rounded-full bg-white/70" />
          <span className="h-1 w-4 rounded-full bg-white/70" />
        </div>
      </div>

      <div
        className="h-4 px-4 flex items-center gap-4"
        style={{ backgroundColor: `${template.color}25` }}
      >
        <span
          className="h-1 w-5 rounded-full"
          style={{ backgroundColor: template.accent }}
        />
        <span
          className="h-1 w-5 rounded-full"
          style={{ backgroundColor: template.accent }}
        />
        <span
          className="h-1 w-5 rounded-full"
          style={{ backgroundColor: template.accent }}
        />
      </div>

      <div className="p-6 flex items-start gap-5 pb-10 bg-white mb-3">
        <div className="w-20 h-20 shrink-0">
          <div
            className="w-full h-full rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: template.softAccent || `${template.accent}30`,
            }}
          >
            <span
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: template.accent }}
            />
          </div>
        </div>

        <div className="pt-3 flex-1">
          <div className="space-y-2">
            <span className="block h-1.5 w-28 bg-black rounded-full" />
            <span className="block h-1.5 w-24 bg-black rounded-full" />
            <span
              className="block h-1 w-12 rounded-full"
              style={{ backgroundColor: template.accent }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-sm font-bold text-black">{template.name}</h3>
          <p className="text-xs text-gray-500 mt-1">By Swift Suite</p>
        </div>

        <div className="flex items-center gap-4">
          {!createdView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(template.id);
              }}
            >
              <Star
                size={18}
                className={
                  favorite
                    ? "text-orange-400 fill-orange-400"
                    : "text-gray-400"
                }
              />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(template.id);
            }}
            className={`w-14 h-8 rounded-full p-1 transition ${
              selected ? "bg-[#027840]" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-6 h-6 rounded-full bg-white transition ${
                selected ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-xs ${
              selected ? "text-[#027840]" : "text-green-500"
            }`}
          >
            {selected ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {createdView && (
        <div className="px-4 py-4 bg-white text-xs text-gray-500">
          Created 23rd May 2026
        </div>
      )}
    </div>
  );
};

const UploadHtmlModal = ({ onClose }) => {
  const [fileName, setFileName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");

  const handleUpload = () => {
    const payload = {
      templateName,
      category,
      fileName,
    };

    console.log("Upload HTML payload:", payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Upload Template</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          <label className="border border-dashed border-gray-300 rounded-xl min-h-[220px] flex flex-col items-center justify-center cursor-pointer">
            <Upload size={42} className="text-[#8fcdb3]" />

            <p className="text-base font-bold text-black mt-4">
              Drag and drop your HTML file here
            </p>

            <p className="text-sm text-[#8fcdb3] mt-2">
              or click to browse .html files only.
            </p>

            <div className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white">
              {fileName || "Choose file"}
            </div>

            <input
              type="file"
              accept=".html"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
          </label>

          <div className="mt-7">
            <label className="text-xl font-bold text-black">Template Name</label>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g My Custom Name"
              className="w-full h-12 mt-4 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#027840] placeholder:text-[#8fcdb3]"
            />
          </div>

          <div className="mt-7">
            <label className="text-xl font-bold text-black">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 mt-4 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#027840] text-[#8fcdb3]"
            >
              <option value="">Select Category</option>
              <option value="Fragrance & Beauty">Fragrance & Beauty</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Electronics & Tech">Electronics & Tech</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Tools & Hardware">Tools & Hardware</option>
              <option value="Jewelry & Watches">Jewelry & Watches</option>
              <option value="Pet Supplies">Pet Supplies</option>
              <option value="Office Business">Office Business</option>
              <option value="Automotive & Parts">Automotive & Parts</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Toys & Collectibles">Toys & Collectibles</option>
              <option value="Health & Wellness">Health & Wellness</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-9">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-500 font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              className="px-5 py-2.5 rounded-lg bg-[#027840] text-white font-semibold"
            >
              Upload and Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListingTemplates = () => {
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const [viewCreatedTemplates, setViewCreatedTemplates] = useState(false);
  const [activeCreatedTab, setActiveCreatedTab] = useState("created");
  const [activeBottomTab, setActiveBottomTab] = useState("myTemplates");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAnalyticsLoading(false);
          return;
        }

        const response = await axios.get(
          "https://service.swiftsuite.app/accounts/dashboard-analytics/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        console.log("Failed to fetch analytics", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const tier = analytics?.tier || "Starter";

  const tierColors = {
    Starter: "#BB8232",
    Growth: "#005D68",
    Premium: "#000000",
    Enterprise: "#027840",
  };

  const limit = planLimits[tier] || 2;
  const planColor = tierColors[tier] || "#BB8232";
  const maxReached = selectedTemplates.length >= limit;

  const handleToggleTemplate = (id) => {
    if (selectedTemplates.includes(id)) {
      setSelectedTemplates((prev) => prev.filter((item) => item !== id));
      return;
    }

    if (selectedTemplates.length >= limit) return;

    setSelectedTemplates((prev) => [...prev, id]);
  };

  const handleFavorite = (id) => {
    setFavoriteTemplates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    if (maxReached && limit !== Infinity) {
      setShowMaxModal(true);
      return;
    }

    setShowCreateModal(true);
  };

  const handleOpenUpload = () => {
    if (maxReached && limit !== Infinity) {
      setShowMaxModal(true);
      return;
    }

    setShowUploadModal(true);
  };

  const createdTemplates = templates.filter((template) =>
    selectedTemplates.includes(template.id)
  );

  const favoriteItems = templates.filter((template) =>
    favoriteTemplates.includes(template.id)
  );

  if (previewTemplate) {
    return (
      <TemplatePreviewModal
        template={previewTemplate}
        selected={selectedTemplates.includes(previewTemplate.id)}
        onToggle={handleToggleTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    );
  }

  if (showCreateModal) {
  return <CreateTemplateModal onClose={() => setShowCreateModal(false)} />;
}

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 lg:p-10 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-black">Listing Templates</h1>
            <p className="text-gray-500 mt-2">
              Manage your marketplace listing templates
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenUpload}
              className="bg-white px-5 py-3 rounded-lg shadow-sm font-semibold flex items-center gap-2"
            >
              Upload HTML
              <Upload size={18} />
            </button>

            <button
              onClick={handleOpenCreate}
              className="bg-[#027840] text-white px-5 py-3 rounded-lg shadow-sm font-semibold flex items-center gap-2"
            >
              Create Template
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search templates by name, category"
              className="w-full h-14 rounded-xl border border-gray-200 bg-white pl-12 pr-4 outline-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 h-14 px-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              ({createdTemplates.length}) Created Templates
            </span>
            <span className="text-sm font-bold">
              {selectedTemplates.length}/
              {limit === Infinity ? "Unlimited" : limit}
            </span>
            <span className="text-sm font-bold">Active</span>
            <span className="text-sm">
              Current Plan:{" "}
              <strong style={{ color: planColor }}>
                {analyticsLoading ? "Loading..." : tier}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-6">
          <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between lg:w-[520px]">
            <div>
              <h3 className="text-sm font-bold">Need more templates?</h3>
              <p className="text-sm text-gray-500">
                Upgrade your plan to activate more
              </p>
            </div>

            <Link to='/pricing' className="bg-[#027840] text-white px-5 py-2 rounded-lg text-sm font-semibold">
              Upgrade plan
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">View created templates</span>
            <button
              onClick={() => setViewCreatedTemplates((prev) => !prev)}
              className={`w-16 h-9 rounded-full p-1 transition ${
                viewCreatedTemplates ? "bg-[#027840]" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-7 h-7 rounded-full bg-white transition ${
                  viewCreatedTemplates ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {viewCreatedTemplates ? (
          <div className="mt-8">
            <div className="flex items-center gap-20 border-b border-gray-300 w-fit">
              <button
                onClick={() => setActiveCreatedTab("created")}
                className={`font-bold pb-3 ${
                  activeCreatedTab === "created"
                    ? "text-[#027840] border-b-2 border-[#027840]"
                    : "text-gray-400"
                }`}
              >
                Created Templates
              </button>

              <button
                onClick={() => setActiveCreatedTab("drafts")}
                className={`font-bold pb-3 ${
                  activeCreatedTab === "drafts"
                    ? "text-[#027840] border-b-2 border-[#027840]"
                    : "text-gray-400"
                }`}
              >
                Drafts(1)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 mt-5">
              {activeCreatedTab === "created" ? (
                createdTemplates.length > 0 ? (
                  createdTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={selectedTemplates.includes(template.id)}
                      disabled={false}
                      favorite={favoriteTemplates.includes(template.id)}
                      onToggle={handleToggleTemplate}
                      onFavorite={handleFavorite}
                      onPreview={setPreviewTemplate}
                      createdView
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No created templates yet.
                  </p>
                )
              ) : (
                <TemplateCard
                  template={templates[2]}
                  selected={false}
                  disabled={false}
                  favorite={false}
                  onToggle={handleToggleTemplate}
                  onFavorite={handleFavorite}
                  onPreview={setPreviewTemplate}
                  createdView
                />
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 mt-8">
              {templates.map((template) => {
                const selected = selectedTemplates.includes(template.id);
                const disabled = maxReached && !selected;

                return (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={selected}
                    disabled={disabled}
                    favorite={favoriteTemplates.includes(template.id)}
                    onToggle={handleToggleTemplate}
                    onFavorite={handleFavorite}
                    onPreview={setPreviewTemplate}
                  />
                );
              })}
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-20 border-b border-gray-300 w-fit">
                <button
                  onClick={() => setActiveBottomTab("myTemplates")}
                  className={`font-bold pb-3 ${
                    activeBottomTab === "myTemplates"
                      ? "text-[#027840] border-b-2 border-[#027840]"
                      : "text-gray-400"
                  }`}
                >
                  My Templates
                </button>

                <button
                  onClick={() => setActiveBottomTab("favorites")}
                  className={`font-bold pb-3 ${
                    activeBottomTab === "favorites"
                      ? "text-[#027840] border-b-2 border-[#027840]"
                      : "text-gray-400"
                  }`}
                >
                  Favorites
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 mt-5">
                {activeBottomTab === "myTemplates" ? (
                  createdTemplates.length > 0 ? (
                    createdTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        selected={selectedTemplates.includes(template.id)}
                        disabled={false}
                        favorite={favoriteTemplates.includes(template.id)}
                        onToggle={handleToggleTemplate}
                        onFavorite={handleFavorite}
                        onPreview={setPreviewTemplate}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No active template yet.
                    </p>
                  )
                ) : favoriteItems.length > 0 ? (
                  favoriteItems.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={selectedTemplates.includes(template.id)}
                      disabled={false}
                      favorite={true}
                      onToggle={handleToggleTemplate}
                      onFavorite={handleFavorite}
                      onPreview={setPreviewTemplate}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No favorite template yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

    {showUploadModal && (
    <UploadTemplateModal onClose={() => setShowUploadModal(false)} />
    )}

      {showCreateModal && (
        <CreateTemplateModal onClose={() => setShowCreateModal(false)} />
      )}

      {showMaxModal && (
        <MaxTemplateModal
          plan={tier}
          limit={limit}
          planColor={planColor}
          onClose={() => setShowMaxModal(false)}
        />
      )}
    </div>
  );
};

export default ListingTemplates;