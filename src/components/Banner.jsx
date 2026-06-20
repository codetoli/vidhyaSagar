import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';

const BANNER_SHOWN_KEY = 'admissionBannerShown';

const Banner = ({ onClose }) => {

    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Already shown this session — skip fetch entirely
        if (sessionStorage.getItem(BANNER_SHOWN_KEY)) {
            setLoading(false);
            return;
        }

        const fetchBanner = async () => {
            try {
                const q = query(
                    collection(db, 'banner'),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                );

                const snap = await getDocs(q);

                if (!snap.empty) {
                    setBanner(snap.docs[0].data());
                }
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchBanner();

    }, []);

    useEffect(() => {

        if (!banner) return;

        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            handleClose();
        }, 10000);

        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };

    }, [banner]);

    // Mark as shown, then call parent's onClose
    const handleClose = () => {
        sessionStorage.setItem(BANNER_SHOWN_KEY, 'true');
        onClose();
    };

    if (loading) return null;
    if (!banner) return null;

    return (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

            <div
                onClick={handleClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            <div
                className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden animate-[popup_.35s_ease]"
            >

                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-20
                    w-9 h-9 rounded-full bg-white shadow-md
                    hover:scale-110 transition"
                >
                    ✕
                </button>

                <div className="w-full max-w-[90vw] sm:max-w-[560px] max-h-[70vh] overflow-hidden">
                    <img
                        src={banner.url}
                        alt={banner.title || 'Admission Banner'}
                        className="w-full h-auto max-h-[70vh] object-contain"
                    />
                </div>

                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-[#1C3F82] mb-2">
                        Admissions Open
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Apply now for new admissions.
                    </p>

                    <div className="flex gap-3 justify-center flex-wrap">
                        <a
                            href="#admissionsSection"
                            onClick={handleClose}
                            className="bg-[#FF6B34]
                            text-white
                            px-5 py-3
                            rounded-full
                            font-semibold
                            hover:bg-[#e55a28]"
                        >
                            Enroll Now
                        </a>

                        <a
                            href="#contact"
                            onClick={handleClose}
                            className="border-2
                            border-[#1C3F82]
                            text-[#1C3F82]
                            px-5 py-3
                            rounded-full
                            font-semibold
                            hover:bg-[#1C3F82]
                            hover:text-white"
                        >
                            Contact
                        </a>
                    </div>
                </div>

            </div>

        </div>

    );

};

export default Banner;