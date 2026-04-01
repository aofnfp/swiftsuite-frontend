import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { handleNextStep, handlePreviousStep } from "../redux/newVendor";

const HOST_VENDORS = ["lipsey", "cwr", "zanders", "ssi"];

const NewVendorInfo2 = () => {
  const dispatch = useDispatch();
  const store = useSelector((s) => s.newVendor.addNewVendor);
  const vendorName = (store?.name || "").toLowerCase();

  const isRSR = vendorName === "rsr";
  const isFragranceX = vendorName === "fragrancex";
  const hasHost = HOST_VENDORS.includes(vendorName);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: store.username || "",
      pos: store.pos || "",
      password: "",
      ftp_username: store.ftp_username || "",
      ftp_password: "",
      host: store.host || "",
      api_access_id: store.api_access_id || "",
      api_access_key: store.api_access_key || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      handleNextStep({
        ...store,
        integration_type: "FTP",
        ...data,
        increment: true,
      })
    );
    toast.success("FTP details saved");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border shadow space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isFragranceX && (
          <>
            <input {...register("api_access_id")} placeholder="API Access ID" className="border p-2 rounded" />
            <input {...register("api_access_key")} placeholder="API Access Key" className="border p-2 rounded" />
          </>
        )}

        {isRSR && (
          <>
            <input {...register("username")} placeholder="Username" className="border p-2 rounded" />
            <input {...register("pos")} placeholder="POS" className="border p-2 rounded" />
            <input {...register("password")} type="password" placeholder="Password" className="border p-2 rounded" />
          </>
        )}

        {!isRSR && !isFragranceX && (
          <>
            <input {...register("ftp_username")} placeholder="FTP Username" className="border p-2 rounded" />
            {hasHost && <input {...register("host")} placeholder="Host" className="border p-2 rounded" />}
            <input {...register("ftp_password")} type="password" placeholder="FTP Password" className="border p-2 rounded" />
          </>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button type="button" onClick={() => dispatch(handlePreviousStep())} className="bg-green-700 text-white px-6 py-2 rounded">
          Back
        </button>
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded">
          Next
        </button>
      </div>

      <Toaster position="top-right" />
    </form>
  );
};

export default NewVendorInfo2;
