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

  const businessEmailCount = countTokensAcrossRows(data, 'BUSINESS_EMAIL', {
    normalize: normalizeEmail,
    validator: isLikelyEmail,
  });

  // Verified Emails (comma-delimited columns)
  const personalVerifiedEmailCount = countTokensAcrossRows(data, 'PERSONAL_VERIFIED_EMAILS', {
    normalize: normalizeEmail,
    validator: isLikelyEmail,
  });

  const businessVerifiedEmailCount = countTokensAcrossRows(data, 'BUSINESS_VERIFIED_EMAILS', {
    normalize: normalizeEmail,
    validator: isLikelyEmail,
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

  // Skiptrace B2B Phone (single value per cell)
  const skiptraceB2BPhoneCount = data.filter(
    (d) => typeof d.SKIPTRACE_B2B_PHONE === 'string' && d.SKIPTRACE_B2B_PHONE.trim() !== ''
  ).length;

  // Social profile URLs
  const facebookUrlCount = data.filter(
    (d) => d.FACEBOOK_URL && d.FACEBOOK_URL.trim() !== ''
  ).length;

  const twitterUrlCount = data.filter(
    (d) => d.TWITTER_URL && d.TWITTER_URL.trim() !== ''
  ).length;

  const homeownerYesCount = data.filter((d) => d.HOMEOWNER === 'Y').length;
  const businessAddressCount = data.filter(
    (d) => typeof d.SKIPTRACE_B2B_ADDRESS === 'string' && d.SKIPTRACE_B2B_ADDRESS.trim() !== ''
  ).length;
  const personalCityCount = data.filter(
    (d) => typeof d.SKIPTRACE_CITY === 'string' && d.SKIPTRACE_CITY.trim() !== ''
  ).length;

  // Skiptrace Address
  const skiptraceAddressCount = data.filter(
    (d) => d.SKIPTRACE_ADDRESS && d.SKIPTRACE_ADDRESS.trim() !== ''
  ).length;

  const stats = [
    {
      title: 'Phone Numbers',
      items: [
        { label: 'Mobile', value: mobilePhoneCount },
        { label: 'Direct', value: directPhoneCount },
        { label: 'Skiptrace', value: skiptraceWirelessCount },
        { label: 'Skiptrace B2B', value: skiptraceB2BPhoneCount },
      ],
      icon: Phone,
    },
    {
      title: 'Emails',
      items: [
        { label: 'Personal', value: personalEmailCount },
        { label: 'Personal Verified', value: personalVerifiedEmailCount },
        { label: 'Business', value: businessEmailCount },
        { label: 'Business Verified', value: businessVerifiedEmailCount },
      ],
      icon: Mail,
    },
    {
      title: 'Social Profiles',
      items: [
        {
          label: 'Personal LinkedIn',
          value: data.filter((d) => d.LINKEDIN_URL && d.LINKEDIN_URL.trim() !== '').length,
        },
        {
          label: 'Company LinkedIn',
          value: data.filter((d) => d.COMPANY_LINKEDIN_URL && d.COMPANY_LINKEDIN_URL.trim() !== '').length,
        },
        { label: 'Facebook URL', value: facebookUrlCount },
        { label: 'Twitter URL', value: twitterUrlCount },
      ],
      icon: Linkedin,
    },
    {
      title: 'Location',
      items: [
        { label: 'Personal Address', value: skiptraceAddressCount },
        { label: 'Personal City', value: personalCityCount },
        { label: 'Business Address', value: businessAddressCount },
        { label: 'Homeowners', value: homeownerYesCount },
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