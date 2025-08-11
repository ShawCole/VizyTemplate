// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { StatCard } from '../ui/StatCard';
import { Phone, Mail, Linkedin, Home } from 'lucide-react';
import { B2BData, B2CData } from '../../types/data';
import {
  countTokensAcrossRows,
  countTokensAcrossRowsForKeys,
  isLikelyEmail,
  normalizeEmail,
  isSha256Hex,
  normalizeHex,
  normalizePhoneDigits,
  isLikelyPhone,
} from '../../utils/tokenizers';

interface ContactDataProps {
  data: B2BData[] | B2CData[];
}

export default function ContactData({ data }: ContactDataProps) {
  useEffect(() => {
    console.log('ContactData - Data Sample:', data.slice(0, 1));
    if (data[0]) {
      console.log('Keys present:', Object.keys(data[0]).join(','));
    }
  }, [data]);

  // Emails
  const personalEmailCount = countTokensAcrossRowsForKeys(
    data,
    ['PERSONAL_EMAIL', 'PERSONAL_EMAILS'],
    {
      normalize: normalizeEmail,
      validator: isLikelyEmail,
      dedupeWithinRowAcrossKeys: false,
    }
  );

  // BUSINESS_EMAIL is single email per row; count valid non-empty cells only
  const businessEmailCount = data.filter(
    (d) => typeof d.BUSINESS_EMAIL === 'string' && d.BUSINESS_EMAIL.trim() !== '' && isLikelyEmail(d.BUSINESS_EMAIL)
  ).length;

  const sha256EmailCount = countTokensAcrossRows(data, 'SHA256_PERSONAL_EMAIL', {
    normalize: normalizeHex,
    validator: isSha256Hex,
  });

  // Phones
  const mobilePhoneCount = countTokensAcrossRows(data, 'MOBILE_PHONE', {
    normalize: normalizePhoneDigits,
    validator: isLikelyPhone,
  });

  const directPhoneCount = countTokensAcrossRows(data, 'DIRECT_NUMBER', {
    normalize: normalizePhoneDigits,
    validator: isLikelyPhone,
  });

  const skiptraceWirelessCount = countTokensAcrossRows(data, 'SKIPTRACE_WIRELESS_NUMBERS', {
    normalize: normalizePhoneDigits,
    validator: isLikelyPhone,
  });

  const homeownerYesCount = data.filter((d) => d.HOMEOWNER === 'Y').length;
  const personalAddressCount = data.filter(
    (d) => typeof d.PERSONAL_ADDRESS === 'string' && d.PERSONAL_ADDRESS.trim() !== ''
  ).length;
  const personalCityCount = data.filter(
    (d) => typeof d.PERSONAL_CITY === 'string' && d.PERSONAL_CITY.trim() !== ''
  ).length;

  const stats = [
    {
      title: 'Phone Numbers',
      items: [
        { label: 'Mobile', value: mobilePhoneCount },
        { label: 'Direct', value: directPhoneCount },
        { label: 'Skiptrace', value: skiptraceWirelessCount },
      ],
      icon: Phone,
    },
    {
      title: 'Emails',
      items: [
        { label: 'Personal', value: personalEmailCount },
        { label: 'Business', value: businessEmailCount },
        { label: 'SHA256', value: sha256EmailCount },
      ],
      icon: Mail,
    },
    {
      title: 'LinkedIn Profiles',
      items: [
        {
          label: 'Personal',
          value: data.filter((d) => d.LINKEDIN_URL && d.LINKEDIN_URL.trim() !== '').length,
        },
        {
          label: 'Company',
          value: data.filter((d) => d.COMPANY_LINKEDIN_URL && d.COMPANY_LINKEDIN_URL.trim() !== '').length,
        },
      ],
      icon: Linkedin,
    },
    {
      title: 'Location',
      items: [
        { label: 'Homeowners', value: homeownerYesCount },
        { label: 'Address', value: personalAddressCount },
        { label: 'City', value: personalCityCount },
      ],
      icon: Home,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}