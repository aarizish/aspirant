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

function addButton(script, spot, role) {
	const btn = add([
		rect(width() * 0.4, height() * 0.1, { radius: 8 }),
		pos(spot),
		area(),
		scale(1),
		anchor("center"),
		outline(4),
	]);

	btn.add([
		text(script, {size: width() * 0.02}),
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

scene("LaunchViewController", () => {
	add([
		text("Aspirant - Homework & Distraction", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.3),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Launch", vec2(width() / 2, height() * 0.45), () => go("MainViewController"));
	addButton("Preferences", vec2(width() / 2, height() * 0.55), () => go("PreferencesViewController"));
	addButton("Shut Down", vec2(width() / 2, height() * 0.65), () => {
		if (window.Android && window.Android.closeApp) {
			window.Android.closeApp();
		} else {
			console.warn("Close app function is not available");
		}
	});
});

scene("PreferencesViewController", () => {
	add([
		text("Preferences", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.2),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Profile", vec2(width() / 2, height() * 0.35), () => go("ProfileViewController"));
	addButton("Difficulty", vec2(width() / 2, height() * 0.45), () => go("DifficultyViewController"));
	addButton("Sound", vec2(width() / 2, height() * 0.55), () => go("SoundViewController"));
	addButton("Sharing", vec2(width() / 2, height() * 0.65), () => shareExperience());
	addButton("Credits", vec2(width() / 2, height() * 0.75), () => go("CreditsViewController"));
	addButton("Central Hub", vec2(width() / 2, height() * 0.85), () => go("LaunchViewController"));
});

scene("ProfileViewController", () => {
	add([
		text("Choose Your Identity!", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.2),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Choose your aspirant to begin the journey of focus and knowledge", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.35),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Boy", vec2(width() / 2, height() * 0.45), () => {
		updateCharacterPreference('male'); debug.log("You are ready to begin your journey.")
	});
	addButton("Girl", vec2(width() / 2, height() * 0.55), () => {
		updateCharacterPreference('female'); debug.log("You are ready to begin your journey.")
	});
	addButton("Central Hub", vec2(width() / 2, height() * 0.65), () => go("LaunchViewController"));
});

scene("SoundViewController", () => {
	add([
		text("Audio Settings", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.2),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Toggle background music to suit your mood", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.35),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("On", vec2(width() / 2, height() * 0.45), () => {
		forceBackgroundAudioPause = false;
		playBackgroundAudio();
	});

	addButton("Off", vec2(width() / 2, height() * 0.55), () => {
		forceBackgroundAudioPause = true;
		pauseBackgroundAudio();
	});

	addButton("Central Hub", vec2(width() / 2, height() * 0.65), () => {
		go("LaunchViewController");
	});
});

scene("DifficultyViewController", () => {
	add([
		text("Choose Your Challenge!", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.2),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Select the difficulty that suits your skills", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.35),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Easy", vec2(width() / 2, height() * 0.45), () => {
		updateDifficultyPreference(7); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Medium", vec2(width() / 2, height() * 0.55), () => {
		updateDifficultyPreference(14); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Hard", vec2(width() / 2, height() * 0.65), () => {
		updateDifficultyPreference(21); debug.log("Your challenge has been set. Proceed!")
	});
	addButton("Central Hub", vec2(width() / 2, height() * 0.75), () => go("LaunchViewController"));
});

scene("CreditsViewController", () => {
	add([
		text("Credits!", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.2),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Developer: Aarizish", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.35),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Sound Effects by Pixabay", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.45),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Background Tune: BEATBOX 02 (Halal Music) by Azad Chaiwala", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.55),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Inspired by Coder Coffee & Bugs", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.65),
		anchor("center"),
		color(255, 255, 255),
	]);
	add([
		text("Sprites designed by pikisuperstar and studiogstock / Freepik.", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.75),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Central Hub", vec2(width() / 2, height() * 0.85), () => go("LaunchViewController"));
});

scene("RetryViewController", ({score}) => {
	add([
		text("Session Ended!", { size: width() * 0.03 }),
		pos(width() / 2, height() * 0.25),
		anchor("center"),
		color(255, 255, 255),
	]);

	add([
		text("Achievement: " + score + " Points", { size: width() * 0.02 }),
		pos(width() / 2, height() * 0.35),
		anchor("center"),
		color(255, 255, 255),
	]);

	addButton("Retry", vec2(width() / 2, height() * 0.45), () => go("MainViewController"));
	addButton("Central Hub", vec2(width() / 2, height() * 0.55), () => go("LaunchViewController"));
});

scene("MainViewController", () => {
	let SPEED = Math.min(width(), height()) / 1.25;
	let ESPEED = Math.min(width(), height()) / 300;
	let SCORE = 0;

	const playerScale = Math.min(width(), height()) / 4500;
	let activeDirection = null;
	let scoreView;

	function addButton(script, spot, role) {
		const btn = add([
			rect(120, 40, { radius: 8 }),
			pos(spot),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
			z(100),
		]);
	
		btn.add([
			text(script, { size: width() * 0.02 }),
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

	function addDirectionalButton(direction, position, movement) {
		addButton(direction, position, () => {
			activeDirection = movement;
		});
	}

	const buttonOffset = 20;
	const screenWidth = width();
	const screenHeight = height();
	const spawnScale = Math.min(width(), height()) / 8000;

	addDirectionalButton("Up", vec2(buttonOffset + 50, screenHeight - 160), { x: 0, y: -SPEED });
	addDirectionalButton("Down", vec2(buttonOffset + 50, screenHeight - 80), { x: 0, y: SPEED });
	addDirectionalButton("Left", vec2(screenWidth - 210, screenHeight - 80), { x: -SPEED, y: 0 });
	addDirectionalButton("Right", vec2(screenWidth - 70, screenHeight - 80), { x: SPEED, y: 0 });

	const player = add([
		sprite(getCharacterPreference()),
		pos(120, 80),
		area(),
		scale(playerScale),
	]);

	onUpdate(() => {
		if (activeDirection) {
			player.move(activeDirection.x, activeDirection.y);
		}
	});

	onMouseRelease(() => {
		activeDirection = null;
	});

	onKeyDown("left", () => {
		playBackgroundAudio();
		player.move(-SPEED, 0);
	});

	onKeyDown("right", () => {
		playBackgroundAudio();
		player.move(SPEED, 0);
	});

	onKeyDown("up", () => {
		playBackgroundAudio();
		player.move(0, -SPEED);
	});

	onKeyDown("down", () => {
		playBackgroundAudio();
		player.move(0, SPEED);
	});

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
				pos(rand(0, width()), height()),
				area(),
				scale(spawnScale),
				"enemy",
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
			scale(spawnScale),
			"book",
		]);

		c.onUpdate(() => {
			c.moveTo(c.pos.x, c.pos.y - ESPEED);
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
			text("Progress: " + SCORE, { size: width() * 0.02 }),
			scale(1),
			pos(width() - 351, 21),
			color(255, 255, 255),
		]);
	};

	displayScore();
});


commence();