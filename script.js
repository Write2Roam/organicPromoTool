document.addEventListener('DOMContentLoaded', () => {
    const inputContent = document.getElementById('inputContent');
    const linkedinOutput = document.getElementById('linkedinOutput');
    const twitterOutput = document.getElementById('twitterOutput');
    const redditOutput = document.getElementById('redditOutput');
    const formatButton = document.getElementById('formatButton');

    formatButton.addEventListener('click', () => {
        const content = inputContent.innerHTML;
        if (!content.trim()) {
            alert('Please enter some content to format.');
            return;
        }

        // Format for LinkedIn
        const linkedinFormatted = formatForLinkedIn(content);
        linkedinOutput.innerHTML = linkedinFormatted;

        // Format for Twitter
        const twitterFormatted = formatForTwitter(content);
        twitterOutput.innerHTML = twitterFormatted;

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

    function formatForLinkedIn(content) {
        const events = extractTextAndLinks(content);
        
        // Create a container for the formatted content
        const container = document.createElement('div');
        container.style.whiteSpace = 'pre-wrap';
        
        // Add the intro
        const intro = document.createElement('p');
        intro.textContent = "Some great stuff going on in ATX this week. If you're a founder, looking to meet people, check these out 👇";
        container.appendChild(intro);
        
        // Add a blank line
        container.appendChild(document.createElement('br'));
        
        // Add the PS message
        const ps = document.createElement('p');
        ps.textContent = "PS. I send a longer version of this to hundreds of founders in ATX every week. You can get it straight to your inbox here: austinbusinessreview.com";
        container.appendChild(ps);
        
        // Add a blank line
        container.appendChild(document.createElement('br'));
        
        // Add each event
        events.forEach(event => {
            // Add the event text
            const eventText = document.createElement('p');
            eventText.textContent = event.text;
            container.appendChild(eventText);
            
            // Add the link
            const link = document.createElement('p');
            link.textContent = `🔗 ${event.url}`;
            container.appendChild(link);
            
            // Add a blank line
            container.appendChild(document.createElement('br'));
        });
        
        return container.outerHTML;
    }

    function formatForTwitter(content) {
        const events = extractTextAndLinks(content);
        
        // Create a container for the formatted content
        const container = document.createElement('div');
        container.style.whiteSpace = 'pre-wrap';
        
        // Add the intro
        const intro = document.createElement('p');
        intro.textContent = "Some great stuff going on in ATX this week. If you're a founder, looking to meet people, check these out 👇";
        container.appendChild(intro);
        
        // Add the PS message
        const ps = document.createElement('p');
        ps.textContent = "PS. I send a longer version of this to hundreds of founders in ATX every week. You can get it straight to your inbox here: austinbusinessreview.com";
        container.appendChild(ps);
        
        // Add each event
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            
            // Add the event text and link in the same paragraph
            const eventP = document.createElement('p');
            eventP.innerHTML = `${event.text}<br>🔗 ${event.url}`;
            container.appendChild(eventP);
        }
        
        return container.outerHTML;
    }

    function formatForReddit(content) {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // Create a container for the formatted content
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
                    // Create a new paragraph with rich text link
                    const newP = document.createElement('p');
                    newP.style.margin = '0';
                    
                    // Clone the original paragraph's content
                    newP.innerHTML = p.innerHTML;
                    
                    // Clean up the link URL
                    const newLink = newP.querySelector('a');
                    if (newLink) {
                        newLink.href = cleanUrl(newLink.href);
                    }
                    
                    container.appendChild(newP);
                }
            }
        });
        
        return container.outerHTML;
    }
}); 