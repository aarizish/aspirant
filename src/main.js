import kaboom from "kaboom";

let backgroundAudio;
let backgroundAudioIsPlaying = false;
let forceBackgroundAudioPause = false;

const AUDIO_PREF_KEY = "backgroundAudioPref";

kaboom({
	font: "monospace",
	background: [34, 34, 34],
});

function commence() {
	initializeState();
	go("LaunchViewController");
}

function initializeState(){
	loadSprite("phone", "sprites/phone.png");
	loadSprite("female", "sprites/female.png");
	loadSprite("male", "sprites/male.png");
	loadSprite("book", "sprites/book.png");

	loadSound("backdrop", "sounds/backdrop-tune.mp3");
	loadSound("game-over", "sounds/game-over.mp3");
	loadSound("flip", "sounds/page-flip.mp3");

	const character = localStorage.getItem('selectedCharacter');
	if (character === null) {
		saveCharacterPreference('male');
	}

	const difficulty = localStorage.getItem('selectedDifficulty');
	if (difficulty === null) {
		saveDifficultyPreference(7);
	}

	if (loadAudioPreference()) {
		playBackgroundAudio();
	} else {
		forceBackgroundAudioPause = true;
	}
}

function getCharacterPreference() {
	return localStorage.getItem('selectedCharacter');
}

function saveCharacterPreference(character) {
	localStorage.setItem('selectedCharacter', character);
}

function updateCharacterPreference(newCharacter) {
	saveCharacterPreference(newCharacter);
}

function getDifficultyPreference() {
	return localStorage.getItem('selectedDifficulty');
}

function saveDifficultyPreference(character) {
	localStorage.setItem('selectedDifficulty', character);
}

function updateDifficultyPreference(newDifficulty) {
	saveDifficultyPreference(newDifficulty);
}

const playBackgroundAudio = () => {
	if (!backgroundAudioIsPlaying && !forceBackgroundAudioPause) {
		backgroundAudio = play("backdrop", { volume: 1, loop: true });
		backgroundAudioIsPlaying = true;
		saveAudioPreference(true);
	}
};

const pauseBackgroundAudio = () => {
	if (backgroundAudio) {
		backgroundAudio.stop();
		backgroundAudioIsPlaying = false;
		saveAudioPreference(false);
	}
};

const saveAudioPreference = (isPlaying) => {
	localStorage.setItem(AUDIO_PREF_KEY, JSON.stringify(isPlaying));
};

const loadAudioPreference = () => {
	const storedPref = localStorage.getItem(AUDIO_PREF_KEY);
	return storedPref ? JSON.parse(storedPref) : true;
};

function shareExperience() {
    const shareMessage = "Dodge distractions and collect books as you navigate the life of a student striving for success. How focused can you stay?";
    const appLink = "https://aarizish.itch.io/aspirant";
    const fullMessage = `${shareMessage}\n\nPlay here: ${appLink}`;

    if (window.Android && window.Android.share) {
        window.Android.share(fullMessage);
    } else {
        if (navigator.share) {
            navigator.share({
                title: 'Aspirant - Homework & Distraction',
                text: fullMessage,
                url: appLink,
            })
            .then(() => console.log('App shared successfully'))
            .catch((error) => console.error('Error sharing app:', error));
        } else {
            const subject = encodeURIComponent("Check out Aspirant - Homework & Distraction");
            const body = encodeURIComponent(fullMessage);
            const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
        }
    }
}


scene("LaunchViewController", () => {
	const screenCenter = center();

	add([
		text("Aspirant - Homework & Distraction", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 100),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Launch", vec2(screenCenter.x, screenCenter.y), () => go("MainViewController"));
	addButton("Preferences", vec2(screenCenter.x, screenCenter.y + 100), () => go("PreferencesViewController"));
	addButton("Shut Down", vec2(screenCenter.x, screenCenter.y + 200), () => {
		if (window.Android && window.Android.closeApp) {
			window.Android.closeApp();
		} else {
			console.warn("Close app function is not available");
		}
	});
});

scene("PreferencesViewController", () => {
	const screenCenter = center();

	add([
		text("Preferences", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 300),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Profile", vec2(screenCenter.x, screenCenter.y - 200), () => go("ProfileViewController"));
	addButton("Difficulty", vec2(screenCenter.x, screenCenter.y - 100), () => go("DifficultyViewController"));
	addButton("Sound", vec2(screenCenter.x, screenCenter.y), () => go("SoundViewController"));
	addButton("Sharing", vec2(screenCenter.x, screenCenter.y + 100), () => shareExperience());
	addButton("Credits", vec2(screenCenter.x, screenCenter.y + 200), () => go("CreditsViewController"));
	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 300), () => go("LaunchViewController"));
});

scene("ProfileViewController", () => {
	const screenCenter = center();

	add([
		text("Choose Your Identity!", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 200),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Choose your aspirant to begin the journey of focus and knowledge", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 100),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Boy", vec2(screenCenter.x, screenCenter.y), () => {
		updateCharacterPreference('male'); debug.log("You are ready to begin your journey.")
	});
	addButton("Girl", vec2(screenCenter.x, screenCenter.y + 100), () => {
		updateCharacterPreference('female'); debug.log("You are ready to begin your journey.")
	});
	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 200), () => go("LaunchViewController"));
});

scene("SoundViewController", () => {
	const screenCenter = center();

	add([
		text("Audio Settings", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 200),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Toggle background music to suit your mood", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 100),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("On", vec2(screenCenter.x, screenCenter.y), () => {
		forceBackgroundAudioPause = false;
		playBackgroundAudio();
	});

	addButton("Off", vec2(screenCenter.x, screenCenter.y + 100), () => {
		forceBackgroundAudioPause = true;
		pauseBackgroundAudio();
	});

	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 200), () => {
		go("LaunchViewController");
	});
});

scene("DifficultyViewController", () => {
	const screenCenter = center();

	add([
		text("Choose Your Challenge!", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 300),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Select the difficulty that suits your skills", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 200),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Easy", vec2(screenCenter.x, screenCenter.y - 100), () => {
		updateDifficultyPreference(7); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Medium", vec2(screenCenter.x, screenCenter.y), () => {
		updateDifficultyPreference(14); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Hard", vec2(screenCenter.x, screenCenter.y + 100), () => {
		updateDifficultyPreference(21); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 200), () => go("LaunchViewController"));
});

scene("CreditsViewController", () => {
	const screenCenter = center();

	add([
		text("Credits!", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 300),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Developer: Aarizish", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 200),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Sound Effects by Pixabay", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 100),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Background Tune: BEATBOX 02 (Halal Music) by Azad Chaiwala", { size: 28 }),
		pos(screenCenter.x, screenCenter.y + 100),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Inspired by Coder Coffee & Bugs", { size: 28 }),
		pos(screenCenter.x, screenCenter.y),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Sprites designed by pikisuperstar and studiogstock / Freepik.", { size: 28 }),
		pos(screenCenter.x, screenCenter.y + 200),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 300), () => go("LaunchViewController"));
});

scene("RetryViewController", ({score}) => {
	const screenCenter = center();

	add([
		text("Session Ended!", { size: 48 }),
		pos(screenCenter.x, screenCenter.y - 200),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Achievement: " + score + " Points", { size: 28 }),
		pos(screenCenter.x, screenCenter.y - 100),
		anchor("center"),
		color(255, 255, 255),
	]);

	function addButton(script, spot, role) {
		const btn = add([
			rect(360, 80, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	addButton("Retry", vec2(screenCenter.x, screenCenter.y), () => go("MainViewController"));
	addButton("Central Hub", vec2(screenCenter.x, screenCenter.y + 100), () => go("LaunchViewController"));
});

scene("MainViewController", () => {
	let SPEED = 620;
	let ESPEED = 2;
	let SCORE = 0;

	let scoreView;

	function addButton(script, spot, role) {
		const btn = add([
			rect(140, 60, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
			z(100),
		]);
	
		btn.add([
			text(script),
			anchor("center"),
			color(0, 0, 0),
		]);
	
		btn.onHoverUpdate(() => {
			const t = time() * 10;
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
			btn.scale = vec2(1.2);
			setCursor("pointer");
		});
	
		btn.onHoverEnd(() => {
			btn.scale = vec2(1);
			btn.color = rgb();
		});
	
		btn.onClick(role);
	
		return btn;
	}

	const buttonOffset = 20;
	const screenWidth = width();
	const screenHeight = height();

	addButton("Up", vec2(buttonOffset + 160, screenHeight - 160), () => {
		onMouseDown(() => {
			player.move(0, -SPEED);
		});
	});
	addButton("Down", vec2(buttonOffset + 160, screenHeight - 80), () => {
		onMouseDown(() => {
			player.move(0, SPEED);
		});
	});
	addButton("Left", vec2(screenWidth - 160, screenHeight - 160), () => {
		onMouseDown(() => {
			player.move(-SPEED, 0);
		});
	});
	addButton("Right", vec2(screenWidth - 160, screenHeight - 80), () => {
		onMouseDown(() => {
			player.move(SPEED, 0);
		});
	});

	const player = add([
		sprite(getCharacterPreference()),
		pos(120, 80),
		area(),
		scale(0.2),
	])

	onKeyDown("left", () => {
		playBackgroundAudio();
		player.move(-SPEED, 0);
	})

	onKeyDown("right", () => {
		playBackgroundAudio();
		player.move(SPEED, 0);
	})

	onKeyDown("up", () => {
		playBackgroundAudio();
		player.move(0, -SPEED);
	})

	onKeyDown("down", () => {
		playBackgroundAudio();
		player.move(0, SPEED);
	})

	player.onCollide("enemy", () => {
		shake(120);
		play("game-over");
		destroy(player);
		addKaboom(player.pos);
		wait(1, () => {
			go("RetryViewController", { score: SCORE });
		});
	});

	player.onCollide("book", (book) => {
		play("flip", {
			volume: 10,
		});
		destroy(book);
		SCORE += 1;
		displayScore();
	});

	loop(1, () => {
		for (let i = 0; i < 4; i++) {
			let x = rand(0, width());
			let y = height();

			let c = add([
				sprite("phone"),
				pos(x, y),
				area(),
				scale(0.13),
				"enemy"
			]);

			c.onUpdate(() => {
				c.moveTo(c.pos.x, c.pos.y - ESPEED);
			});
		}

		let x = rand(0, width());
		let y = height();

		let c = add([
			sprite("book"),
			pos(x, y),
			area(),
			scale(0.13),
			"book"
		]);

		c.onUpdate(() => {
			c.moveTo(c.pos.x, c.pos.y - ESPEED)
		});

		if (ESPEED < parseInt(getDifficultyPreference())) {
			ESPEED += 1;
		}
	});

	const displayScore = () => {
		if (scoreView) {
			destroy(scoreView);
		}
		scoreView = add([
			text("Progress: " + SCORE),
			scale(1),
			pos(width() - 351, 21),
			color(255, 255, 255),
		])
	}

	displayScore();
});

commence();