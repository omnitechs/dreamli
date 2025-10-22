export default function Head({ params }: { params: { slug: string; modelId: string } }) {
  const title = decodeURIComponent((params?.slug || '3d-model').replace(/-/g, ' '));
  return (
    <>
      <title>{`${title} – 3D Model`}</title>
      <meta name="robots" content="index, follow" />
      <meta name="description" content={`View 3D model "${title}" with images and details.`} />
      <meta property="og:title" content={`${title} – 3D Model`} />
      <meta property="og:description" content={`View 3D model "${title}" with images and details.`} />
    </>
  );
}
