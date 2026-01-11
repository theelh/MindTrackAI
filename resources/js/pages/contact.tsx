import React, { useState, ChangeEvent, FormEvent } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  

  const { t } = useTranslation();
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("contact.breadcrumb"),
      href: "/contact",
    },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(t("contact.success"));
        toast.success(t("contact.success"));
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(t("contact.error"));
        toast.error(t("contact.error"));
      }
    } catch (error) {
      setStatus(t("contact.serverError"));
      toast.error(t("contact.serverError"));
    }

    setLoading(false);
  };

  const { i18n } = useTranslation();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t("contact.title")} />
      <section className={`px-12 py-10 gap-5 ${
        i18n.language === "ar" ? "flex-col" : "flex"
      }`}>
        <div className="flex-col w-[50%] gap-10 items-center">
          <div>
            <h1 className="text-3xl font-bold mb-6">{t("contact.header")}</h1>
            <p className="max-w-md mb-5 text-[16px] text-[#656565]">
              {t("contact.description")}
            </p>
          </div>
          <div>
            <img className="rounded-2xl" src="/img/20943705.jpg" alt="contact" />
          </div>
        </div>

        <div className="flex-col w-[50%]">
          <div className="justify-center mt-[7rem] flex items-center">
            <img
              className="rounded-2xl"
              src="/img/imgi_44_arrow-1.png"
              alt="arrow"
            />
          </div>
          <div className="w-[100%] mt-5 bg-white border p-8 rounded-2xl shadow-lg shadow-black/20">
            {status && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">{t("contact.name")}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder={t("contact.namePlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">{t("contact.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder={t("contact.emailPlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">{t("contact.message")}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows={5}
                  placeholder={t("contact.messagePlaceholder")}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="hover:scale-[1.09] shadow-black/20 hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                disabled={loading}
              >
                {loading ? t("contact.sending") : t("contact.submit")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default ContactPage;