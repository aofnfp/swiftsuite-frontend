import Loader from "../hooks/Loader";

const LoaderCard = () => {
  return (
    <div className="overflow-x-auto p-10 mt-20 shadow-lg relative bg-white mx-10">
      <Loader />
    </div>
  );
}

export default LoaderCard;
