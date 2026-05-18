from pathlib import Path

path = Path(__file__).parent / "index.html"
text = path.read_text(encoding="utf-8")

controls_start = text.find('            <motion class="carousel__controls carousel__controls--inline">')
if controls_start == -1:
    controls_start = text.find('            <div class="carousel__controls carousel__controls--inline">')

players_carousel = text.find('          <div class="players carousel"', controls_start)

controls_html = text[controls_start:players_carousel].strip()
text = text[:controls_start] + text[players_carousel:]

insert_after = text.find('          </motion>\n        </motion>\n      </motion>', text.find('data-carousel="players"'))
# find closing of players carousel - after players__track viewport carousel

anchor = '          </motion>\n        </motion>\n      </section>'
anchor = '          </motion>\n        </motion>\n      </motion>'
# wrong

idx = text.find('data-carousel="players"')
close = text.find('          </motion>\n        </motion>', idx)
# still wrong

idx = text.find('data-carousel="players"')
pos = text.find('            </motion>\n          </motion>', idx)
insert_at = pos + len('            </motion>\n          </motion>')

# read file lines
lines = text.splitlines(keepends=True)
out = []
i = 0
while i < len(lines):
    line = lines[i]
    if 'carousel__controls--inline' in line and 'players' in ''.join(lines[max(0,i-3):i]):
        # skip until after controls closing div inside section__head
        while i < len(lines) and not (lines[i].strip() == '</motion>' and 'section__head' in ''.join(lines[max(0,i-15):i])):
            if lines[i].strip() == '</motion>' and i > 0 and 'carousel__controls' in ''.join(lines[max(0,i-20):i]):
                i += 1
                break
            i += 1
        continue
    out.append(line)
    i += 1

path.write_text(''.join(out), encoding='utf-8')
