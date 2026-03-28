"use client"; 

import { useData } from "@/src/context/DataContext";
import { MdAdd, MdEdit, MdDelete, MdStar, MdPeople } from "react-icons/md";
import Link from "next/link"; 
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

export default function Mentors() {
  const { mentors, deleteMentor } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteMentor(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
          <p className="text-gray-600 mt-2">Manage all mentor profiles and assignments</p>
        </div>
        
        <Link href="/admin/mentors/add">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <MdAdd className="w-5 h-5" />
            Add Mentor
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MdStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                  mentor.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {mentor.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{mentor.email}</p>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{mentor.bio}</p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Expertise:</p>
              <p className="text-sm font-medium text-gray-800">{mentor.expertise}</p>
            </div>

            

            <div className="flex items-center gap-2">
              <Link href={`/admin/mentors/edit/${mentor.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <MdEdit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => setDeleteId(mentor.id)}
              >
                <MdDelete className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this mentor profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}