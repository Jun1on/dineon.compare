"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Select() {
  const [open, setOpen] = React.useState(false);
  const [schools, setSchools] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.dineoncampus.com/v1/sites/public")
      .then((res) => res.json())
      .then((data) => {
        setSchools(
          data.sites.map((school: { name: string; slug: string }) => ({
            name: school.name,
            slug: school.slug,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to fetch schools", error);
      });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <HoverBorderGradient className="w-[300px]" open={open}>
            <span>Select your school</span>
          </HoverBorderGradient>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search school" />
          <CommandEmpty>
            {schools.length ? "School not found" : "Loading..."}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {schools.map((option: { name: string; slug: string }) => (
                <CommandItem
                  style={{ cursor: "pointer" }}
                  key={option.slug}
                  value={option.slug}
                  onSelect={() => {
                    window.location.href = "/" + option.slug;
                  }}
                >
                  {option.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
