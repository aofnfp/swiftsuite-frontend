import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { TbXboxX } from "react-icons/tb";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handlePreviousStep } from "../redux/newVendor";
import { CircleLoader } from "../CustomVendors/CustomVendorInfo";

const NewVendorInfo3 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((s) => s.newVendor.addNewVendor);
  const [loading, setLoading] = useState(false);

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      credentials:
        Array.isArray(store.api_details) && store.api_details.length > 0
          ? store.api_details
          : [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "credentials",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const credentials = data.credentials
      .filter((c) => c.key || c.value)
      .map((c) => ({
        key: String(c.key || "").trim(),
        value: String(c.value || "").trim(),
      }));

    const rawPayload = {
      ...store,
      api_details: credentials,
    };

    const payload = { ...rawPayload };
    delete payload.integration_type;

    const isEdit = Boolean(payload.id);

    const endpoint = isEdit
      ? `https://service.swiftsuite.app/api/v2/vendor-admin/${payload.id}/`
      : "https://service.swiftsuite.app/api/v2/vendor-admin/";

    const method = isEdit ? "put" : "post";

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== "" &&
        key !== "logo" &&
        key !== "api_details"
      ) {
        formData.append(key, value);
      }
    });

    formData.append("api_details", JSON.stringify(credentials));

    if (!store.logo) {
      toast.error("Logo missing");
      setLoading(false);
      return;
    }

    const res = await fetch(store.logo);
    const blob = await res.blob();
    const logoFile = new File([blob], "logo.png", { type: blob.type });
    formData.append("logo", logoFile);

    console.group("🚀 FINAL SUBMISSION DEBUG");
    console.log("Method:", method);
    console.log("Endpoint:", endpoint);

    console.group("Redux Store Snapshot");
    console.log(store);
    console.groupEnd();

    console.group("FormData Payload");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, {
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else {
        console.log(key, value);
      }
    }
    console.groupEnd();
    console.groupEnd();

    try {
      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Vendor submitted successfully");
      navigate("/admin_layout/success-vendor-data-pull");
    } catch (err) {
      console.error("❌ SUBMISSION ERROR", err.response?.data || err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border shadow space-y-6"
    >
      <button
        type="button"
        onClick={() => append({ key: "", value: "" })}
        className="bg-gray-200 p-2 rounded-full text-green-700"
      >
        <Plus size={16} />
      </button>

      {fields.map((item, i) => (
        <div key={item.id} className="grid grid-cols-2 gap-4">
          <input
            {...register(`credentials.${i}.key`)}
            placeholder="Key"
            className="border p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              {...register(`credentials.${i}.value`)}
              placeholder="Value"
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              disabled={fields.length === 1}
              onClick={() => remove(i)}
            >
              <TbXboxX size={24} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => dispatch(handlePreviousStep())}
          className="bg-green-700 text-white px-6 py-2 rounded"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {loading ? (
            <>
              <CircleLoader className="h-4 w-4 text-white" />
              <span>Pulling...</span>
            </>
          ) : (
            "Pull Data"
          )}
        </button>
      </div>

      <Toaster position="top-right" />
    </form>
  );
};

export default NewVendorInfo3;
