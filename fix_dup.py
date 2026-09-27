with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

next_section_marker = '<section class="step-section" id="process-engine"'
step_pos = content.find(next_section_marker)
print(f"Step section at char: {step_pos}")

# Find </section> just before step_pos by searching backwards
search_from = step_pos
tag = '</section>'
close_pos = content.rfind(tag, 0, step_pos)
print(f"Last </section> before step: {close_pos}")
print(f"Context around close: {repr(content[close_pos-20:close_pos+20])}")
print(f"Chars between: {step_pos - (close_pos + len(tag))}")
print(f"Content between: {repr(content[close_pos+len(tag):step_pos][:200])}")
