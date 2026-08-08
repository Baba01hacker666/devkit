import { Metadata } from "next";
import { ToolDispatcher } from "@/components/tools/ToolDispatcher";
import { getToolByRouteOrId } from "@/lib/tools-registry";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolByRouteOrId(slug);

  if (!tool) {
    return {
      title: "Tool Not Found - DevKit",
    };
  }

  return {
    title: `${tool.name} - DevKit Developer Tools`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | DevKit`,
      description: tool.description,
    },
  };
}

export default async function ToolsRoutePage({ params }: PageProps) {
  const { slug } = await params;
  return <ToolDispatcher slug={slug} />;
}
