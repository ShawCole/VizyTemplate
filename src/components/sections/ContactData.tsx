// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { StatCard } from '../ui/StatCard';
import { Phone, Mail, Linkedin, Home } from 'lucide-react';
import { B2BData, B2CData } from '../../types/data';

interface ContactDataProps {
  data: B2BData[] | B2CData[];
}

export default function ContactData({ data }: ContactDataProps) {
  // Add debugging to check data
  useEffect(() => {
    console.log("ContactData - Data Sample:", data.slice(0, 3));
    console.log("ContactData - Personal Email Count:", data.filter(d => d.PERSONAL_EMAIL && d.PERSONAL_EMAIL.trim() !== '').length);
    console.log("ContactData - Business Email Count:", data.filter(d => d.BUSINESS_EMAIL && d.BUSINESS_EMAIL.trim() !== '').length);
    console.log("ContactData - SHA256 Email Count:", data.filter(d => d.SHA256_PERSONAL_EMAIL && d.SHA256_PERSONAL_EMAIL.trim() !== '').length);
  }, [data]);

  // Improved filter conditions with better null checking
  const personalEmailCount = data.filter(d =>
    d.PERSONAL_EMAIL &&
    typeof d.PERSONAL_EMAIL === 'string' &&
    d.PERSONAL_EMAIL.trim() !== ''
  ).length;

  const businessEmailCount = data.filter(d =>
    d.BUSINESS_EMAIL &&
    typeof d.BUSINESS_EMAIL === 'string' &&
    d.BUSINESS_EMAIL.trim() !== ''
  ).length;

  const sha256EmailCount = data.filter(d =>
    d.SHA256_PERSONAL_EMAIL &&
    typeof d.SHA256_PERSONAL_EMAIL === 'string' &&
    d.SHA256_PERSONAL_EMAIL.trim() !== ''
  ).length;

  const stats = [
    {
      title: 'Phone Numbers',
      items: [
        { label: 'Mobile', value: data.filter(d => d.MOBILE_PHONE && d.MOBILE_PHONE.trim() !== '').length },
        { label: 'Direct', value: data.filter(d => d.DIRECT_NUMBER && d.DIRECT_NUMBER.trim() !== '').length },
        { label: 'Skiptrace', value: data.filter(d => d.SKIPTRACE_WIRELESS_NUMBERS && d.SKIPTRACE_WIRELESS_NUMBERS.trim() !== '').length }
      ],
      icon: Phone
    },
    {
      title: 'Emails',
      items: [
        { label: 'Personal', value: personalEmailCount },
        { label: 'Business', value: businessEmailCount },
        { label: 'SHA256', value: sha256EmailCount }
      ],
      icon: Mail
    },
    {
      title: 'LinkedIn Profiles',
      items: [
        {
          label: 'Personal',
          value: data.filter(d => d.LINKEDIN_URL && d.LINKEDIN_URL.trim() !== '').length
        },
        {
          label: 'Company',
          value: data.filter(d => d.COMPANY_LINKEDIN_URL && d.COMPANY_LINKEDIN_URL.trim() !== '').length
        }
      ],
      icon: Linkedin
    },
    {
      title: 'Homeowners',
      items: [
        {
          label: 'Yes',
          value: data.filter(d => d.HOMEOWNER === 'Y').length
        }
      ],
      icon: Home
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}