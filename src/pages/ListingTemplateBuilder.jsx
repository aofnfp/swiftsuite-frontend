import React, { useMemo, useState } from "react";

const ListingTemplateBuilder = () => {
  const [html, setHtml] = useState(`
<div class="listing">
  <h1>Product Title</h1>
  <p>This is the product description.</p>
  <button>Buy Now</button>
</div>
`);

  const [css, setCss] = useState(`
.listing {
  font-family: Arial, sans-serif;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.listing h1 {
  color: #027840;
}

.listing button {
  background: #027840;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
}
`);

  const previewCode = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }, [html, css]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5">
      <div className="space-y-4">
        <div>
          <label className="font-semibold">HTML</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-[260px] mt-2 p-4 border rounded-xl font-mono text-sm"
          />
        </div>

        <div>
          <label className="font-semibold">CSS</label>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-[260px] mt-2 p-4 border rounded-xl font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Live Preview</h2>
        <iframe
          title="Listing Template Preview"
          srcDoc={previewCode}
          sandbox="allow-same-origin"
          className="w-full h-[600px] border rounded-xl bg-white"
        />
      </div>
    </div>
  );
};

export default ListingTemplateBuilder;    