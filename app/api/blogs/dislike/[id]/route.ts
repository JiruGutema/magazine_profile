import { NextResponse, NextRequest } from "next/server";
import { POST as reactionPost } from "../../reaction/route";

// Legacy route: route through secured reaction handler
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const blogId = parseInt(id, 10);
  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
  }

  // Forward as POST to secured reaction handler
  const forwardReq = new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ postId: blogId, action: "dislike" }),
  });

  return reactionPost(forwardReq);
}
