import HomeClient from "./HomeClient.jsx";
import { fetchDataFromApi } from "@/utils/api";

export default async function HomePage() {
  const bannerData = await fetchDataFromApi("/api/banners");
  return <HomeClient bannerData={bannerData} />;
}
