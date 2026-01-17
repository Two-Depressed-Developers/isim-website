import React from "react";

export function FlagPL({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className={className}
      {...props}
    >
      <g fillRule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z" />
        <path fill="#dc143c" d="M640 480H0V240h640z" />
      </g>
    </svg>
  );
}

export function FlagGB({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className={className}
      {...props}
    >
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
      />
      <path
        fill="#C8102E"
        d="M424 294l216 163v23H426l-186-139v-47l184 139zm0-108L640 51V28L424 186h-48l214-158h50L374 241v-55zm-208 0L0 27v23l184 136v47L0 94l216 163v-55H216zm0 108L0 429v23l214-158h48L48 452h-50l218-158v55z"
      />
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
    </svg>
  );
}
