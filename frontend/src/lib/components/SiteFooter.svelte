<script lang="ts">
  import type { AppMessages } from '../i18n'

  export let footer: AppMessages['footer']

  const currentYear = new Date().getFullYear()
</script>

<footer class="site-footer">
  <div class="footer-meta">
    <a href={`mailto:${footer.email}`} aria-label={footer.emailLabel}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.2 8 5.2 8-5.2V7l-8 5.2L4 7v1.2Z" />
      </svg>
      <span>{footer.email}</span>
    </a>

    <span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
      <span>{footer.location}</span>
    </span>
  </div>

  <div class="footer-socials" aria-label={footer.socialLabel}>
    <a href={footer.githubUrl} target="_blank" rel="noreferrer" aria-label={footer.githubLabel}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18A10.94 10.94 0 0 1 12 6.09c.98 0 1.95.13 2.87.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.66.42.36.78 1.07.78 2.16v3.21c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
        />
      </svg>
    </a>

    <a href={footer.linkedinUrl} target="_blank" rel="noreferrer" aria-label={footer.linkedinLabel}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V8.99h3.41v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.53V8.99H7.1v11.46z"
        />
      </svg>
    </a>
  </div>

  <p>© {currentYear} {footer.name}. {footer.credit}</p>
</footer>
