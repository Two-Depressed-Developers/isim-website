"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface StaffMember {
    id: number;
    title: string;
    firstname: string;
    lastname: string;
    avatar?: {
      url?: string;
    };
    accounts: {
      skos: string;
      badap: string;
    };
}


const Staff = () => {

    const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/staffs?populate=*`);
        console.log('Staff:', response.data.data);
        setStaff(response.data.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    }

    fetchStaff();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">Our Staff</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member: StaffMember) => (
            <div key={member.id} className="border p-4 rounded shadow">
              <Avatar>
                <AvatarImage className='w-16 h-16 rounded-full' src={`${member.avatar?.url ? `${process.env.NEXT_PUBLIC_API_URL}${member.avatar?.url}` : "https://github.com/shadcn.png"}`} />
                <AvatarFallback>{member.firstname[0]}{member.lastname[0]}</AvatarFallback>                
              </Avatar>
              <h2 className="text-xl font-bold">
                {member.firstname} {member.lastname}
              </h2>
              <p className="text-gray-700">{member.title}</p>
              <div className="flex space-x-2 mt-2">
                <a
                  href={member.accounts.skos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  SKOS
                </a>
                <a
                  href={member.accounts.badap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  BADAP
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;