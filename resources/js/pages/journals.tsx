import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { journals } from '@/routes';
import axios from 'axios';

interface JournalEntry {
  id: number;
  text_content: string;
  media_path?: string;
  media_type: 'text' | 'audio' | 'image';
  created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Journals Entries',
    href: journals().url,
  },
];

interface Props {
  journals: JournalEntry[];
  flash?: { success?: string };
}

const Index: React.FC<Props> = ({ journals, flash }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, any>>({}); // store results by entry id

  // 🗑 Delete journal
  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/journals/${deleteId}`, {
        onSuccess: () => console.log('Deleted successfully'),
      });
      setShowModal(false);
    }
  };

  // 🧠 Analyze emotion
  const handleAnalyze = async (entryId: number) => {
  try {
    const response = await axios.post('/emotion/analyze', {
      journal_entry_id: entryId,
    });

    if (response.data.success) {
      alert(`Emotion: ${response.data.data.emotion_label} (Confidence: ${response.data.data.confidence})`);
    }
  } catch (error) {
    console.error(error);
    alert('❌ Failed to analyze emotion.');
  }
};


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <Head title="My Journals" />

        {flash?.success && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {flash.success}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">My Journal Entries</h1>

        <ul className="space-y-4">
          {journals.length === 0 && <li>No journal entries yet.</li>}

          {journals.map((entry) => (
            <li
              key={entry.id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="mb-2 text-gray-700">{entry.text_content}</p>

                {entry.media_path && (
                  <p>
                    Media:{' '}
                    <a
                      href={entry.media_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-2">
                  {entry.created_at}
                </p>

                <button
                  onClick={() => handleAnalyze(entry.id)}
                  disabled={loadingId === entry.id}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loadingId === entry.id ? 'Analyzing...' : 'Analyze Emotion'}
                </button>

                {/* 🎭 Show emotion result */}
                {results[entry.id] && (
                  <div className="mt-3 bg-gray-100 p-3 rounded-lg">
                    <p>
                      <strong>Emotion:</strong>{' '}
                      <span className="text-indigo-600">
                        {results[entry.id].emotion_label}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(results[entry.id].confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded shadow"
                  onClick={() => {
                    setDeleteId(entry.id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* 🧾 Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-2">Delete Confirmation</h2>
              <p className="mb-4">
                Are you sure you want to delete this journal entry? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
