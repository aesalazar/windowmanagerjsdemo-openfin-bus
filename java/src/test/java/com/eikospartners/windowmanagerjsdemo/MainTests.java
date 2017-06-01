package windowmangerjsdemo;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;

import org.junit.Test;

public class MainTests {

    @Test
    public void greeterSaysHello() {
        assertThat("Hello World!", containsString("Hello"));
    }

}