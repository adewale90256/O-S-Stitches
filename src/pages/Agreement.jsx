import { useEffect, useState } from "react";
import { Check, LoaderCircle, X, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";

import { getAgreementByToken, respondToAgreement } from "../lib/agreements";

import brand from "../config/brand";
import agreementTerms from "../data/agreementTerms";

function Agreement() {
  const { token } = useParams();

  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAgreement() {
      try {
        const result = await getAgreementByToken(token);

        if (!cancelled) {
          setAgreement(result);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load agreement:", error);

        if (!cancelled) {
          setError(error.message || "Unable to load this agreement.");
          setLoading(false);
        }
      }
    }

    if (token) {
      loadAgreement();
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleResponse(status) {
    if (responding || !agreement) return;

    const action =
      status === "accepted" ? "accept this agreement" : "reject this agreement";

    const confirmed = window.confirm(`Are you sure you want to ${action}?`);

    if (!confirmed) return;

    try {
      setResponding(true);
      setError("");
      setSuccess("");

      // 1. Save the customer's decision first
      const result = await respondToAgreement(token, status);

      // 2. Update the agreement on the page
      if (result.agreement) {
        setAgreement(result.agreement);
      } else {
        setAgreement((current) => ({
          ...current,
          status,
        }));
      }

      // 3. Show confirmation
      setSuccess(
        status === "accepted"
          ? "Agreement accepted successfully."
          : "Agreement rejected successfully.",
      );

      // 4. Prepare the WhatsApp message
      const whatsappNumber = (brand.contact.whatsapp || "").replace(/\D/g, "");

      if (!whatsappNumber) {
        setError(
          "Your response was saved, but the WhatsApp contact has not been configured.",
        );
        return;
      }

      const message = `Hello, I have ${
        status === "accepted" ? "accepted" : "rejected"
      } the sewing agreement.

Customer: ${agreement.customerName}
Agreement: ${agreement.itemDescription}
Amount: ₦${Number(agreement.price).toLocaleString("en-NG")}
Status: ${status.toUpperCase()}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // 5. Open WhatsApp
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error("Failed to respond to agreement:", error);

      setError(
        error.message || "Unable to update the agreement. Please try again.",
      );
    } finally {
      setResponding(false);
    }
  }

  function formatCurrency(value) {
    return `₦${Number(value || 0).toLocaleString("en-NG")}`;
  }

  function getStatusLabel(status) {
    if (status === "accepted") return "Accepted";
    if (status === "rejected") return "Rejected";

    return "Pending";
  }

  function getStatusClasses(status) {
    if (status === "accepted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] bg-stone-50 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle
              size={40}
              className="mx-auto text-red-400"
              strokeWidth={1.5}
            />

            <h1 className="mt-5 text-xl font-semibold text-slate-900">
              Agreement unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Invalid agreement link.
            </p>

            <p className="mt-5 text-xs text-slate-400">
              Please contact O-S Stitches if you believe you received this link
              in error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-stone-50 px-4 py-16">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <LoaderCircle
              size={20}
              className="animate-spin"
              style={{ color: brand.colors.accent }}
            />
            Loading agreement...
          </div>
        </div>
      </div>
    );
  }

  if (error && !agreement) {
    return (
      <div className="min-h-[70vh] bg-stone-50 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle
              size={40}
              className="mx-auto text-red-400"
              strokeWidth={1.5}
            />

            <h1 className="mt-5 text-xl font-semibold text-slate-900">
              Agreement unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

            <p className="mt-5 text-xs text-slate-400">
              Please contact O-S Stitches if you believe you received this link
              in error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPending = agreement.status === "pending";

  return (
    <div className="min-h-[70vh] bg-stone-50 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: brand.colors.accent }}
          >
            O-S Stitches
          </p>

          <h1
            className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
            style={{ color: brand.colors.primary }}
          >
            Customer Agreement
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Please review the details of your order and agreement carefully
            before accepting.
          </p>
        </div>

        {/* Agreement Card */}
        <div className="border border-slate-200 bg-white shadow-sm">
          {/* Agreement Header */}
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Customer
                </p>

                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {agreement.customerName}
                </h2>

                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p>{agreement.customerPhone}</p>

                  {agreement.customerEmail && <p>{agreement.customerEmail}</p>}
                </div>
              </div>

              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                  agreement.status,
                )}`}
              >
                {getStatusLabel(agreement.status)}
              </span>
            </div>
          </div>

          <div className="space-y-8 px-6 py-7 sm:px-8 sm:py-9">
            {/* Order Details */}
            <section>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: brand.colors.accent }}
              >
                Order Details
              </p>

              <div className="mt-3 border border-slate-200 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {agreement.itemDescription}
                </p>
              </div>
            </section>

            {/* Payment */}
            <section>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: brand.colors.accent }}
              >
                Payment Structure
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="border border-slate-200 p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Total Agreement
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {formatCurrency(agreement.price)}
                  </p>
                </div>

                <div className="border border-slate-200 p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    70% Upfront
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {formatCurrency(agreement.upfrontAmount)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Required before cloth delivery.
                  </p>
                </div>

                <div className="border border-slate-200 p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    30% Balance
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {formatCurrency(agreement.balanceAmount)}
                  </p>
                </div>
              </div>
            </section>

            {/* Terms */}
            <section>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: brand.colors.accent }}
              >
                {agreementTerms.title}
              </p>

              <div className="mt-3 border border-slate-200 p-5 sm:p-6">
                <div className="space-y-7">
                  <p className="text-sm leading-7 text-slate-600">
                    {agreementTerms.intro}
                  </p>

                  {agreementTerms.terms.map((term) => (
                    <div
                      key={term.number}
                      className="border-t border-slate-100 pt-6 first:border-t-0 first:pt-0"
                    >
                      <h3
                        className="text-sm font-semibold tracking-wide"
                        style={{ color: brand.colors.primary }}
                      >
                        {term.number}. {term.title}
                      </h3>

                      <div className="mt-3 space-y-3">
                        {term.paragraphs?.map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-sm leading-7 text-slate-600"
                          >
                            {paragraph}
                          </p>
                        ))}

                        {term.bullets && (
                          <ul className="space-y-2 pl-5 text-sm leading-7 text-slate-600">
                            {term.bullets.map((bullet) => (
                              <li key={bullet} className="list-disc">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {term.closing && (
                          <p className="text-sm leading-7 text-slate-600">
                            {term.closing}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm leading-7 text-slate-600">
                      {agreementTerms.closing}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Check size={18} className="mt-0.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            {/* Actions */}
            {isPending ? (
              <section className="border-t border-slate-200 pt-7">
                <p className="text-center text-xs leading-5 text-slate-500">
                  By accepting this agreement, you confirm that you have
                  reviewed the order details, price, and payment structure.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => handleResponse("rejected")}
                    disabled={responding}
                    className="inline-flex items-center justify-center gap-2 border border-red-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {responding ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <X size={15} />
                    )}
                    Reject Agreement
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResponse("accepted")}
                    disabled={responding}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: brand.colors.primary }}
                  >
                    {responding ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    Accept Agreement
                  </button>
                </div>
              </section>
            ) : (
              <section className="border-t border-slate-200 pt-7 text-center">
                {agreement.status === "accepted" ? (
                  <>
                    <Check
                      size={38}
                      className="mx-auto text-emerald-600"
                      strokeWidth={1.5}
                    />

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      Agreement Accepted
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Thank you. Your agreement has been recorded successfully.
                    </p>
                  </>
                ) : (
                  <>
                    <X
                      size={38}
                      className="mx-auto text-red-500"
                      strokeWidth={1.5}
                    />

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      Agreement Rejected
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      This agreement has been marked as rejected.
                    </p>
                  </>
                )}
              </section>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.12em] text-slate-400">
          O-S Stitches • Customer Agreement
        </p>
      </div>
    </div>
  );
}

export default Agreement;
