document.addEventListener('DOMContentLoaded', () => {
    const inputContent = document.getElementById('inputContent');
    const socialOutput = document.getElementById('socialOutput');
    const redditOutput = document.getElementById('redditOutput');
    const formatButton = document.getElementById('formatButton');

    formatButton.addEventListener('click', () => {
        const content = inputContent.innerHTML;
        if (!content.trim()) {
            alert('Please enter some content to format.');
            return;
        }

        // Format for Twitter/LinkedIn
        const socialFormatted = formatForSocial(content);
        socialOutput.textContent = socialFormatted;

        // Format for Reddit
        const redditFormatted = formatForReddit(content);
        redditOutput.innerHTML = redditFormatted;
    });

    function cleanUrl(url) {
        // Remove everything after the question mark
        return url.split('?')[0];
    }

    function cleanHtmlEntities(text) {
        // Replace HTML entities with their actual characters
        return text.replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'");
    }

    function extractTextAndLinks(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Find all paragraphs
        const paragraphs = tempDiv.getElementsByTagName('p');
        const events = [];

        // Process each paragraph
        Array.from(paragraphs).forEach(p => {
            const text = p.textContent.trim();
            if (text.startsWith('🗓️')) {
                // Find the link in this paragraph
                const link = p.querySelector('a');
                if (link) {
                    events.push({
                        text: text,
                        url: cleanUrl(link.href)
                    });
                }
            }
        });

        return events;
    }

    function formatForSocial(content) {
        const events = extractTextAndLinks(content);
        const formattedLines = [];

        // Add the introductory text and PS message
        formattedLines.push("Some great stuff going on in ATX this week. If you're a founder, looking to meet people, check these out 👇");
        formattedLines.push("PS. I send a longer version of this to hundreds of founders in ATX every week. You can get it straight to your inbox here: austinbusinessreview.com");

        events.forEach(event => {
            // Add the event text and link on the same line
            formattedLines.push(`${event.text}\n🔗 ${event.url}`);
        });

        // Join events with double line breaks
        return formattedLines.join('\n\n');
    }

    function formatForReddit(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        // Create a container for all events
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1em';

        // Find all paragraphs
        const paragraphs = tempDiv.getElementsByTagName('p');

        // Process each paragraph
        Array.from(paragraphs).forEach(p => {
            const text = p.textContent.trim();
            if (text.startsWith('🗓️')) {
                // Find the link in this paragraph
                const link = p.querySelector('a');
                if (link) {
                    // Get the text before and after the link
                    const linkText = link.textContent;
                    const beforeLink = text.substring(0, text.indexOf(linkText));
                    const afterLink = text.substring(text.indexOf(linkText) + linkText.length);
                    
                    // Create a new paragraph with rich text link
                    const newP = document.createElement('p');
                    newP.style.margin = '0';
                    newP.innerHTML = beforeLink;
                    
                    // Create and append the link
                    const newLink = document.createElement('a');
                    newLink.href = cleanUrl(link.href);
                    newLink.textContent = linkText;
                    newP.appendChild(newLink);
                    
                    // Append the text after the link
                    newP.appendChild(document.createTextNode(afterLink));
                    
                    container.appendChild(newP);
                }
            }
        });

        return container.outerHTML;
    }
}); 