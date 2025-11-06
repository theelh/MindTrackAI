import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import App from '@/actions/App';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface FormData {
  text_content: string;
  media: File | null;
  media_type: 'text' | 'audio' | 'image';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Journals',
        href: '/journal/create',
    },
];

const CreateJournal: React.FC = () => {
  const { data, setData, post, errors, processing } = useForm<FormData>({
    text_content: '',
    media: null,
    media_type: 'text',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text_content', data.text_content);
    formData.append('media_type', data.media_type);
    if (data.media) formData.append('media', data.media);

    post('/journals', {
      data: formData,
      onSuccess: () =>
        setData({
          text_content: '',
          media: null,
          media_type: 'text',
        }),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6">
      <Head title="Add Journal Entry" />

      <h1 className="text-2xl font-bold mb-4">Add New Journal Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Text Content</label>
          <textarea
            className="border p-2 w-full"
            value={data.text_content}
            onChange={(e) => setData('text_content', e.target.value)}
          />
          {errors.text_content && (
            <p className="text-red-500">{errors.text_content}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Media Type</label>
          <select
            className="border p-2 w-full"
            value={data.media_type}
            onChange={(e) =>
              setData('media_type', e.target.value as FormData['media_type'])
            }
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
          </select>
          {errors.media_type && (
            <p className="text-red-500">{errors.media_type}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Upload Media</label>
          <input
            type="file"
            onChange={(e) =>
              setData('media', e.target.files?.[0] || null)
            }
          />
          {errors.media && <p className="text-red-500">{errors.media}</p>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {processing ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      <Link href="/journals" className="text-blue-500 underline mt-4 inline-block">
        Back to Journals
      </Link>
    </div>
    </AppLayout>
  );
};

export default CreateJournal;