import { redirect } from "react-router";
import { axiosInstance } from "~/root";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const response = await axiosInstance.post("booking/confirm", formData);
  console.log(response);
  return redirect("/booking/response");
}
export async function clientLoader() {
  const response = await axiosInstance.get("booking/request-summary");
  console.log("request-summary get:", response);
  return response;
}
