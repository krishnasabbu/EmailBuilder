import { useEffect, useState } from 'react';
import { ChevronDown, Link, ImageIcon, MousePointerClick, Eye } from 'lucide-react';

type ComponentItem = {
  tcmId: string;
  title: string;
  value: string;
};

function CollapsibleSection({
  title,
  icon: Icon,
  items,
  onPreviewImage,
  isImageSection = false,
}: {
  title: string;
  icon: any;
  items: ComponentItem[];
  onPreviewImage?: (src: string) => void;
  isImageSection?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-2xl shadow-sm mb-4 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <Icon className="w-5 h-5 text-gray-600" />
          {title}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-t">
          <div className="grid grid-cols-12 font-semibold text-sm text-gray-600 border-b pb-2 mb-2">
            <div className="col-span-4">TCM ID</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-4">Value</div>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 text-sm items-center text-gray-800 py-2 border-b last:border-none"
            >
              <div className="col-span-4 truncate">{item.tcmId}</div>
              <div className="col-span-4 truncate">{item.title}</div>
              <div className="col-span-4 truncate">
                {isImageSection ? (
                  <button
                    onClick={() => onPreviewImage?.(item.value)}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComponentManager() {
  const [links, setLinks] = useState<ComponentItem[]>([]);
  const [images, setImages] = useState<ComponentItem[]>([]);
  const [buttons, setButtons] = useState<ComponentItem[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Simulated API response
    const response = {
      links: [
        { tcmId: 'L001', title: 'Google', value: 'https://google.com' },
        { tcmId: 'L002', title: 'YouTube', value: 'https://youtube.com' },
        { tcmId: 'L003', title: 'GitHub', value: 'https://github.com' },
        { tcmId: 'L004', title: 'Twitter', value: 'https://twitter.com' },
        { tcmId: 'L005', title: 'Reddit', value: 'https://reddit.com' },
      ],
      images: [
        { tcmId: 'I001', title: 'Hero', value: 'https://via.placeholder.com/300' },
        { tcmId: 'I002', title: 'Logo', value: 'https://via.placeholder.com/100' },
        { tcmId: 'I003', title: 'Banner', value: 'https://via.placeholder.com/250' },
        { tcmId: 'I004', title: 'Thumbnail', value: 'https://via.placeholder.com/80' },
        { tcmId: 'I005', title: 'Screenshot', value: 'https://via.placeholder.com/200' },
      ],
      buttons: [
        { tcmId: 'B001', title: 'Sign Up', value: 'https://example.com/signup' },
        { tcmId: 'B002', title: 'Contact', value: 'https://example.com/contact' },
        { tcmId: 'B003', title: 'Subscribe', value: 'https://example.com/subscribe' },
        { tcmId: 'B004', title: 'Learn More', value: 'https://example.com/learn' },
        { tcmId: 'B005', title: 'Download', value: 'https://example.com/download' },
      ],
    };

    setLinks(response.links);
    setImages(response.images);
    setButtons(response.buttons);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const [linksRes, imagesRes, buttonsRes] = await Promise.all([
        fetch('/api/components/links'),
        fetch('/api/components/images'),
        fetch('/api/components/buttons'),
        ]);

        const [linksRaw, imagesRaw, buttonsRaw] = await Promise.all([
        linksRes.json(),
        imagesRes.json(),
        buttonsRes.json(),
        ]);

        const normalize = (items: any[]): ComponentItem[] =>
        items.map((item) => ({
            tcmId: item.tcmId,
            title: item.title,
            value: item.content?.text?.[0] ?? '',
        }));

        setLinks(normalize(linksRaw));
        setImages(normalize(imagesRaw));
        setButtons(normalize(buttonsRaw));
    };

    fetchData();
  }, []);


  return (
    <div className="max-w-4xl mx-auto mt-8 relative">
      <CollapsibleSection title="Links" icon={Link} items={links} />
      <CollapsibleSection
        title="Images"
        icon={ImageIcon}
        items={images}
        isImageSection
        onPreviewImage={(src) => setPreviewImage(src)}
      />
      <CollapsibleSection title="CTA Buttons" icon={MousePointerClick} items={buttons} />

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-lg">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded mb-4" />
            <button
              onClick={() => setPreviewImage(null)}
              className="block mx-auto mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
