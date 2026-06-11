"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAppStore } from "@/store/app-store";
import type { UserRole } from "@/types";

export type ClassMembershipOption = {
  classId: string;
  name: string;
  school: string;
  schoolYear: string;
  role: UserRole;
};

export function useClassMemberships() {
  const selectedClassId = useAppStore((state) => state.selectedClassId);
  const setSelectedClassId = useAppStore((state) => state.setSelectedClassId);
  const [classes, setClasses] = useState<ClassMembershipOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadClasses() {
      if (!isSupabaseConfigured) {
        return;
      }

      const supabase = getBrowserSupabaseClient();

      if (!supabase) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (isMounted) {
          setError("Bitte melde dich an, um Klassen zu laden.");
          setIsLoading(false);
        }
        return;
      }

      const { data, error: membershipsError } = await supabase
        .from("class_members")
        .select("role, classes(id, name, school, school_year)")
        .eq("user_id", user.id);

      if (!isMounted) {
        return;
      }

      if (membershipsError) {
        setError(membershipsError.message);
        setIsLoading(false);
        return;
      }

      const mapped =
        data?.flatMap((item) => {
          const classRow = Array.isArray(item.classes)
            ? item.classes[0]
            : item.classes;

          if (!classRow) {
            return [];
          }

          return [
            {
              classId: String(classRow.id),
              name: String(classRow.name),
              school: String(classRow.school),
              schoolYear: String(classRow.school_year),
              role: item.role as UserRole,
            },
          ];
        }) ?? [];

      setClasses(mapped);

      if (!selectedClassId && mapped[0]) {
        setSelectedClassId(mapped[0].classId);
      }

      setIsLoading(false);
    }

    void loadClasses();

    return () => {
      isMounted = false;
    };
  }, [selectedClassId, setSelectedClassId]);

  const selectedClass = useMemo(
    () => classes.find((item) => item.classId === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  return {
    classes,
    selectedClass,
    selectedClassId,
    setSelectedClassId,
    isLoading,
    error,
  };
}
