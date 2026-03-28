"use client";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/src/context/DataContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { MdArrowBack } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function AddCoursePage() {
  const { id } = useParams();
  const router = useRouter(); // 'navigate' ko 'router' kar diya taaki niche conflict na ho
  const { addCourse, updateCourse, getCourse, mentors } = useData();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    mentorId: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (isEdit && id) {
      const course = getCourse(id as string);
      if (course) {
        setFormData({
          title: course.title,
          instructor: course.instructor,
          mentorId: course.mentorId,
          category: course.category,
          duration: course.duration,
          price: course.price,
          description: course.description,
          level: course.level,
          status: course.status,
        });
      }
    }
  }, [id, isEdit, getCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      updateCourse(id as string, formData);
      toast.success("Course updated successfully!");
    } else {
      addCourse(formData);
      toast.success("Course added successfully!");
    }
    
    router.push("/admin/courses/");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMentorChange = (mentorId: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    setFormData((prev) => ({ 
      ...prev, 
      mentorId,
      instructor: mentor?.name || ""
    }));
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        onClick={() => router.push("/admin/courses/")}
      >
        <MdArrowBack className="w-5 h-5" />
        Back to Courses
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Course" : "Add New Course"}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit ? "Update course details" : "Fill in the details to create a new course"}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Complete Web Development Bootcamp"
              required
            />
          </div>

          <div>
            <Label htmlFor="mentorId">Assign Mentor *</Label>
            <Select value={formData.mentorId} onValueChange={handleMentorChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.filter((m) => m.status === "Active").map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.name} - {mentor.expertise.split(",")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. Web Development"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g. 12 weeks"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="e.g. ₹4,999"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Difficulty Level *</Label>
              <Select value={formData.level} onValueChange={(value) => handleChange("level", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
              {isEdit ? "Update Course" : "Add Course"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/courses/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}