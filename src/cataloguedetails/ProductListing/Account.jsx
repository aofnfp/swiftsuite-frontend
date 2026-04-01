import { Select, SelectItem } from "@nextui-org/react";
import { ebayAccount, ebayMarket } from "./data";
import { BsSearch } from "react-icons/bs";

const Account = () => {
  const colors = ["primary"];

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <section className="bg-[#E7F2ED] p-5">
      <div className="lg:ms-[24%]">
        <div className="flex justify-between ">
          {colors.map((color) => (
            <Select
              onChange={handleChange}
              key={color}
              color={color}
              label="Favorite Account"
              placeholder="Select an account"
              defaultSelectedKeys={["ebayaccount"]}
              className="max-w-xs"
            >
              {ebayAccount.map((account) => (
                <SelectItem key={account.key} value={account.key}>
                  {account.label}
                </SelectItem>
              ))}
            </Select>
          ))}

          {colors.map((color) => (
            <Select
              key={`${color}-market`}
              color={color}
              label="Favorite Market"
              placeholder="Select a market"
              defaultSelectedKeys={["ebaymarket"]}
              className="max-w-xs"
            >
              {ebayMarket.map((market) => (
                <SelectItem key={market.key} value={market.key}>
                  {market.label}
                </SelectItem>
              ))}
            </Select>
          ))}
        </div>
        <div className="mt-3">
          <h1 className="text-lg font-bold">General Settings</h1>
        <div className="flex lg:w-[100%] md:w-[50%] rounded-2xl h-[40px]  md:ms-0 items-center lg:gap-[100px] bg-white md:gap-[100px]">
          <input
            className="py-3 bg-transparent outline-none px-2  w-[200px] md:w-[100%]"
            type="text"
            placeholder="Tell us about your product. Enter a keyword, UPC or ISBN to search"
            />
          <button
            type="submit"
            className="text-white bg-[#089451] px-3 h-[34px] rounded-r-2xl cursor-pointer lg:ms-28"
            >
            <BsSearch className="" />
          </button>
        </div>
              </div>
      </div>
    </section>
  );
};

export default Account;
