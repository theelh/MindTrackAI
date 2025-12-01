import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import App from '@/actions/App';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { ChevronRightIcon, MinusIcon, MoveRightIcon } from 'lucide-react';

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

  onSuccess: () => {
    toast.success("Journal entry created successfully!");
    setData({
      text_content: "",
      media: null,
      media_type: "text",
    });
  },

  onError: (errors) => {
    Object.values(errors).forEach((err) => toast.error(err as string));
  },
});

};


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6">
      <Head title="Add Journal Entry" />
      <h1 className="text-2xl font-bold mb-4">Add New Journal Entry</h1>
      <ul className="mb-4 p-6 hover:text-black text-[#6b6a6a] bg-white border border-black/25  rounded-xl flex flex-col lg:mb-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-300">
        <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#dbdbd7] dark:before:border-[#3E3E3A]">
            <span className="relative bg-white py-1 dark:bg-[#161615]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#dbdbd7] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                </span>
            </span>
            <span>
                1. Create your journal (Text, Image, Audio)
            </span>
        </li>
        <li className="relative flex items-center gap-1 py-2 before:absolute before:top-0  before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#dbdbd7] dark:before:border-[#3E3E3A]">
          <div className="flex items-center">
            <span className="relative bg-white py-1 dark:bg-[#161615]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#dbdbd7] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                </span>
            </span>
            <span className="relative bg-white py-1 dark:bg-[#161615]">
                <MinusIcon className="text-[#dbdbd7] text-sm"/>
            </span>
          </div>
            <span>
                2. Go to journals entries to analyze your emotion
            </span>
        </li>
        <li className="relative flex items-center gap-1 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#dbdbd7] dark:before:border-[#3E3E3A]">
            <div className="flex items-center">
              <span className="relative bg-white py-1 dark:bg-[#161615]">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#dbdbd7] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                </span>
              </span>
              <span className="relative bg-white py-1 dark:bg-[#161615]">
                  <MinusIcon className="text-[#dbdbd7] text-sm"/>
              </span>
              <span className="relative bg-white py-1 dark:bg-[#161615]">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#dbdbd7] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                  </span>
              </span>
              <span className="relative bg-white py-1 dark:bg-[#161615]">
                  <MinusIcon className="text-[#dbdbd7] text-sm"/>
              </span>
            </div>
            <span>
                3. Check your analytics section to see your progresses
            </span>
        </li>
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4 mt-[7rem]">
        <div>
          <label className="block font-medium">Text Content</label>
          <textarea
            className="border p-2 border-black/25 bg-white rounded-xl w-full"
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