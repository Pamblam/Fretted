
# Fretted

Create fretboard diagrams for scales and chords of any fretted instrument.

### Usage

TLDR? [**Code samples here.**](https://pamblam.github.io/Fretted/)

All methods start with your instrument. The two that are included out of the box are `Guitar` and `Ukulele`.

   Fretted.Guitar();

You can define other instruments (or other versions of the existing ones) with the `makeInstrument` method. This method requires a name, the number of frets it has, the number of strings it has, its tuning (from the bottom to the top). You can optionally specify an array of fret numbers that should have a single or double fret marker.

    Fretted.makeInstrument({ 
      name: 'Mandolin', 
      frets: 20, 
      strings: 4, 
      doubleFretMarkers: [12], 
      singleFretMarkers: [3,5,7,10,15], 
      tuning: ["E","A","D","G"] 
    });
    // Now "Mandolin" is available
    Fretted.Mandolin();

If you render this now you'll get an empty fretboard laid out horizontally. You can make it vertical if you want by changing its orientation.

     Fretted.Guitar().orientation(Fretted.VERTICAL);

To make a chord diagram, you need to create an array of `String` instances and pass  it to the `makeChord`  method, ordered  from the bottom to the top string. You must create a string for every string your instrument has. All methods are optional.

    var string1 = new Fretted.String() // New string
	  .setFret(5) // Mark 5th fret
	  .setNote("A") // Label the 5th fret an "A"
	  .setBGColor("#4286f4") // Set the marker background
	  .setTextColor("#ffe95b) // Set the marker text color
	var string2 = new Fretted.String(); // Open string
	var string3 = new Fretted.mute(); // Muted string
	//...
	// Make a chord
    Fretboard.Guitar()
      .makeChord([string1, string2, string3, string4, string5, string6]);

To make a scale chart you need to first create an instance of a `Scale` and then pass it to the `makeScale` method. The `setNote` and `setRootNote` must be called.

    var c_maj_scale = new Fretted.Scale()
      .setNotes(['C','D','E','F','G','A','B']) // notes of the scale
      .setRootNote("C") // set the first noe in the scal
      .setNoteStyle(green)
      .setRootNoteStyle(blue, yellow);